const sequelize = require("../database/connection");
const { UnbanTemp } = require("./actions");

module.exports = {
	TempbanCreate: async (guildId, targetTag, targetId, reason, expireTime) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
		});
		if (dbGuild === null) return;
		const tempban = await sequelize.models.tempban.create({
			targetTag,
			targetId,
			reason,
			expireTime: parseInt(expireTime),
			guildId: dbGuild.id,
		});

		return tempban.id;
	},
	TempbanDelete: tempbanId => {
		TempBanDel(tempbanId);
	},

	TempbanRestore: async client => {
		const table = await sequelize.models.guild.findOne({
			where: {},
			include: [{ model: sequelize.models.tempban }],
		});
		if (table === null) return;

		const time = Date.now();

		for (const tb of table.tempbans) {
			const dbGuild = await sequelize.models.guild.findOne({
				where: { id: tb.guildId },
			});
			if (dbGuild === null) continue;

			const target = {
				tag: tb.targetTag,
				id: tb.targetId,
			};

			const guild = await client.guilds.cache.get(dbGuild.guildId);

			if (tb.ExpireTime - time <= 0) {
				try {
					await UnbanTemp(
						client,
						guild,
						target,
						client.user,
						client.bulbutils.translate("global_mod_action_log", {
							action: "Auto-unbanned",
							moderator_tag: client.user.tag,
							moderator_id: client.user.id,
							target_tag: target.tag,
							target_id: target.TargetId,
							reason: tb.Reason,
						}),
						tb.Reason,
					);
				} catch (error) {
					continue;
				}

				await TempBanDel(tb.id);
			} else {
				setTimeout(async function () {
					await UnbanTemp(
						client,
						guild,
						target,
						client.user,
						client.bulbutils.translate("global_mod_action_log", {
							action: "Auto-unbanned",
							moderator_tag: client.user.tag,
							moderator_id: client.user.id,
							target_tag: target.tag,
							target_id: target.TargetId,
							reason: tb.Reason,
						}),
						tb.Reason,
					);

					await TempBanDel(tb.id);
				}, tb.ExpireTime - time);
			}
		}
	},
};

async function TempBanDel(tempbanId) {
	const dbGuild = await sequelize.models.guild.findOne({
		where: {},
		include: [
			{
				model: sequelize.models.tempban,
				where: {
					id: tempbanId,
				},
			},
		],
	});
	if (dbGuild === null) return;

	await dbGuild.tempbans[0].destroy();
}

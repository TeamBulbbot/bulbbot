const sequelize = require("../database/connection");
const DatabaseManager = new (require("../database/DatabaseManager"))
const { UnbanTemp, Unmute } = require("./actions");

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

			if (tb.expireTime - time <= 0) {
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
							reason: tb.reason,
						}),
						tb.reason,
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
							reason: tb.reason,
						}),
						tb.reason,
					);

					await TempBanDel(tb.id);
				}, tb.expireTime - time);
			}
		}
		console.log("[CLIENT - Temp Bans] Successfully restored the temp bans");
	},

	TempmuteCreate: async (guildId, targetTag, targetId, reason, expireTime) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
		});
		if (dbGuild === null) return;
		const tempmute = await sequelize.models.tempmute.create({
			targetTag,
			targetId,
			reason,
			expireTime: parseInt(expireTime),
			guildId: dbGuild.id,
		});

		return tempmute.id;
	},
	TempmuteDelete: tempmuteId => {
		TempMuteDel(tempmuteId);
	},

	TempmuteRestore: async client => {
		const table = await sequelize.models.guild.findOne({
			where: {},
			include: [{ model: sequelize.models.tempmute }],
		});
		if (table === null) return;

		const time = Date.now();

		for (const tb of table.tempmutes) {
			const dbGuild = await sequelize.models.guild.findOne({
				where: { id: tb.guildId },
			});
			//console.log(tb, [tb.dataValues.reason, tb.dataValues.targetTag]);
			if (dbGuild === null) continue;

			const target = {
				tag: tb.targetTag,
				id: tb.targetId,
			};

			const guild = await client.guilds.cache.get(dbGuild.guildId);

			//console.log(tb.expireTime - time);
			if (tb.expireTime - time <= 0) {
				try {
					await Unmute(
						client,
						guild,
						target,
						client.user,
						client.bulbutils.translate("global_mod_action_log", guild.id, {
							action: "Auto-unmuted",
							moderator_tag: client.user.tag,
							moderator_id: client.user.id,
							target_tag: target.tag,
							target_id: target.TargetId,
							reason: tb.reason,
						}),
						tb.reason,
						await DatabaseManager.getMuteRole(guild),
					);
				} catch (error) {
					continue;
				}

				await TempMuteDel(tb.id);
			} else {
				setTimeout(async function () {
					await Unmute(
						client,
						guild,
						target,
						client.user,
						client.bulbutils.translate("global_mod_action_log", guild.id, {
							action: "Auto-unmuted",
							moderator_tag: client.user.tag,
							moderator_id: client.user.id,
							target_tag: target.tag,
							target_id: target.TargetId,
							reason: tb.reason,
						}),
						tb.reason,
						await DatabaseManager.getMuteRole(guild),
					);

					await TempMuteDel(tb.id);
				}, tb.expireTime - time);
			}
		}
		console.log("[CLIENT - Mutes] Successfully restored the mute");
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

async function TempMuteDel(tempmuteId) {
	const dbGuild = await sequelize.models.guild.findOne({
		where: {},
		include: [
			{
				model: sequelize.models.tempmute,
				where: {
					id: tempmuteId,
				},
			},
		],
	});
	if (dbGuild === null) return;

	await dbGuild.tempmutes[0].destroy();
}

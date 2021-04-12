const sequelize = require("../database/connection");
const DatabaseManager = new (require("../database/DatabaseManager"))();
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

			const guild = await client.guilds.fetch(dbGuild.guildId);

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
							target_id: target.targetId,
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
							target_id: target.targetId,
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
		const dbData = await sequelize.models.guild.findAll({
			where: {},
			include: [{ model: sequelize.models.tempmute }],
		});
		const time = Date.now();

		dbData.forEach(async dbGuild => {
			if (dbGuild.tempmutes === undefined || dbGuild.tempmutes.length == 0) return;

			for (const mute of dbGuild.tempmutes) {
				const guild = await client.guilds.fetch(dbGuild.guildId);
				if (guild === null || guild === undefined) return;

				const target = {
					tag: mute.targetTag,
					id: mute.targetId,
				};

				if (mute.expireTime - time <= 0) {
					console.log(`[CLIENT - Mutes] Successfully removed a mute on target ${target.tag} (${target.id})`);
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
								target_id: target.targetId,
								reason: mute.reason,
							}),
							mute.reason,
							await DatabaseManager.getMuteRole(guild),
						);
					} catch (error) {
						console.error(`[Client - Mutes - Restore] ${error}`);
						continue;
					}

					await TempMuteDel(mute.id);
				} else {
					console.log(`[CLIENT - Mutes] Successfully set a mute on target ${target.tag} (${target.id})`);
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
								target_id: target.targetId,
								reason: mute.reason,
							}),
							mute.reason,
							await DatabaseManager.getMuteRole(guild),
						);

						await TempMuteDel(mute.id);
					}, mute.expireTime - time);
				}
			}
			console.log("[CLIENT - Mutes] Successfully restored the mutes");
		});
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

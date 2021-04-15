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
		const dbData = await sequelize.models.guild.findAll({
			where: {},
			include: [{ model: sequelize.models.tempban }],
		});
		const time = Date.now();

		dbData.forEach(async dbGuild => {
			if (dbGuild.tempbans === undefined || dbGuild.tempbans.length == 0) return;

			for (const ban of dbGuild.tempbans) {
				const guild = await client.guilds.fetch(dbGuild.guildId);
				if (guild === null || guild === undefined) return;

				const target = {
					tag: ban.targetTag,
					id: ban.targetId,
				};

				if (ban.expireTime - time <= 0) {
					try {
						await UnbanTemp(
							client,
							guild,
							target,
							client.user,
							client.bulbutils.translate("global_mod_action_log", guild.id, {
								action: "Auto-unbanned",
								moderator_tag: client.user.tag,
								moderator_id: client.user.id,
								target_tag: target.tag,
								target_id: target.targetId,
								reason: ban.reason,
							}),
							ban.reason,
						);
					} catch (error) {
						console.error(`[Client - Temp Bans - Restore] ${error} ${target.tag} (${target.id}) ; Guild ID: ${guild.id}`);
					}
					await TempBanDel(ban.id);
					console.log(`[CLIENT - Temp Bans] Successfully removed a ban from target ${target.tag} (${target.id}) ; Guild ID: ${guild.id}`);
				} else {
					console.log(`[CLIENT - Temp Bans] Successfully set a timer on the ban on target ${target.tag} (${target.id})`);
					setTimeout(async function () {
						await UnbanTemp(
							client,
							guild,
							target,
							client.user,
							client.bulbutils.translate("global_mod_action_log", guild.id, {
								action: "Auto-unbanned",
								moderator_tag: client.user.tag,
								moderator_id: client.user.id,
								target_tag: target.tag,
								target_id: target.targetId,
								reason: ban.reason,
							}),
							ban.reason,
						);

						await TempBanDel(ban.id);
					}, ban.expireTime - time);
				}
			}
			console.log("[CLIENT - Temp Bans] Successfully restored the temp bans");
		});
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
						console.error(`[Client - Mutes - Restore] ${error} ${target.tag} (${target.id}) ; Guild ID: ${guild.id}`);
					}

					await TempMuteDel(mute.id);
					console.log(`[CLIENT - Mutes] Successfully removed a mute on target ${target.tag} (${target.id}) ; Guild ID: ${guild.id}`);
				} else {
					console.log(`[CLIENT - Mutes] Successfully set a mute on target ${target.tag} (${target.id}) ; Guild ID: ${guild.id}`);
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

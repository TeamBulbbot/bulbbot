const { createInfraction } = require("../InfractionUtils");
const { SendModAction, SendModActionTemp, SendAutoUnban } = require("./log");
const utils = require("../BulbBotUtils");
const Utils = new utils();

module.exports = {
	Warn: async (client, guild, target, moderator, reason, reasonLog) => {
		const infId = await createInfraction(guild.id, "Warn", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_warn", guild.id), target.user, moderator, reasonLog, infId);

		return infId;
	},

	Mute: async (client, guild, target, moderator, reason, reasonLog, muteRole, until) => {
		await guild.member(target.id).roles.add(muteRole);
		const infId = await createInfraction(guild.id, "Mute", until, reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModActionTemp(client, guild, await Utils.translate("action_mute", guild.id), target.user, moderator, reasonLog, infId, until);

		return infId;
	},

	UnmuteManual: async (client, guild, target, moderator, reason, reasonLog, muteRole) => {
		await guild.member(target.id).roles.remove(muteRole);
		const infId = await createInfraction(guild.id, "Unmute", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_unmute", guild.id), target.user, moderator, reasonLog, infId);

		return infId;
	},

	Unmute: async (client, guild, target, moderator, reason, reasonLog, muteRole) => {
		if (!guild || !guild.member(target.id)) return;
		await guild.member(target.id).roles.remove(muteRole);
		const infId = await createInfraction(guild.id, "Unmute", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendAutoUnban(client, guild, await Utils.translate("action_unmute_auto", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	Kick: async (client, guild, target, moderator, reason, reasonLog) => {
		const offender = guild.member(target.id);
		if (!offender.kickable) return;
		reason = await reason;
		await offender.kick(reason);
		const infId = await createInfraction(guild.id, "Kick", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_kick", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	Ban: async (client, guild, target, moderator, reason, reasonLog) => {
		const offender = guild.member(target.id);
		if (!offender) return;
		if (!offender.bannable) return;
		reason = await reason;
		await offender.ban({ reason });
		const infId = await createInfraction(guild.id, "Ban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_ban", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	TempBan: async (client, guild, target, moderator, reason, reasonLog, until) => {
		reason = await reason;
		await guild.member(target.id).ban({ reason });
		const infId = await createInfraction(guild.id, "Temp-ban", until, reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModActionTemp(client, guild, await Utils.translate("action_ban_temp", guild.id), target, moderator, reasonLog, infId, until);

		return infId;
	},

	ForceBan: async (client, guild, target, moderator, reason, reasonLog) => {
		reason = await reason;
		await guild.members.ban(target.id, { reason });
		const infId = await createInfraction(guild.id, "Force-ban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_ban_force", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	SoftBan: async (client, guild, target, moderator, reason, reasonLog, days) => {
		reason = await reason;
		await guild.member(target.id).ban({ reason, days });
		await guild.members.unban(target.id, reason);

		const infId = await createInfraction(guild.id, "Softban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_ban_soft", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	CleanBan: async (client, guild, target, moderator, reason, reasonLog, days) => {
		reason = await reason;
		await guild.member(target.id).ban({ reason, days });

		const infId = await createInfraction(guild.id, "Softban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_ban_soft", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	Unban: async (client, guild, target, moderator, reason, reasonLog) => {
		reason = await reason;
		await guild.members.unban(target.id, reason);
		const infId = await createInfraction(guild.id, "Unban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_unban", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	UnbanTemp: async (client, guild, target, moderator, reason, reasonLog) => {
		reason = await reason;
		await guild.members.unban(target.id, reason);
		const infId = await createInfraction(guild.id, "Auto-unban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendAutoUnban(client, guild, await Utils.translate("action_unban_auto", guild.id), target, moderator, reasonLog, infId);

		return infId;
	},

	Deafen: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.setDeaf(true, { reason });
		const infId = await createInfraction(guild.id, "Deafen", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_deafen", guild.id), target.user, moderator, reasonLog, infId);

		return infId;
	},

	Undeafen: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.setDeaf(false);
		const infId = await createInfraction(guild.id, "Undeafen", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_undeafen", guild.id), target.user, moderator, reasonLog, infId);

		return infId;
	},

	Voicekick: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.kick();
		const infId = await createInfraction(guild.id, "Voice-kick", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, await Utils.translate("action_kick_voice", guild.id), target.user, moderator, reasonLog, infId);

		return infId;
	},
};

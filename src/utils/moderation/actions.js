const { createInfraction } = require("../InfractionUtils");
const { SendModAction, SendModActionTemp, SendAutoUnban } = require("./log");

module.exports = {
	Warn: async (client, guild, target, moderator, reason, reasonLog) => {
		const infId = await createInfraction(guild.id, "Warn", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "warned", target.user, moderator, reasonLog, infId);

		return infId;
	},

	Mute: async (client, guild, target, moderator, reason, reasonLog, muteRole, until) => {
		await guild.member(target.id).roles.add(muteRole);
		const infId = await createInfraction(guild.id, "Mute", until, reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModActionTemp(client, guild, "muted", target.user, moderator, reasonLog, infId, until);

		return infId;
	},

	UnmuteManual: async (client, guild, target, moderator, reason, reasonLog, muteRole) => {
		await guild.member(target.id).roles.remove(muteRole)
		const infId = await createInfraction(guild.id, "Unmute", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "unmuted", target.user, moderator, reasonLog, infId);

		return infId;
	},

	Unmute: async (client, guild, target, moderator, reason, reasonLog, muteRole) => {
		await guild.member(target.id).roles.remove(muteRole);
		const infId = await createInfraction(guild.id, "Unmute", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendAutoUnban(client, guild, "automatically unmuted", target.user, moderator, reasonLog, infId);

		return infId;
	},

	Kick: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.member(target.id).kick(reason);
		const infId = await createInfraction(guild.id, "Kick", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "kicked", target, moderator, reasonLog, infId);

		return infId;
	},

	Ban: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.member(target.id).ban({ reason });
		const infId = await createInfraction(guild.id, "Ban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "banned", target, moderator, reasonLog, infId);

		return infId;
	},

	TempBan: async (client, guild, target, moderator, reason, reasonLog, until) => {
		await guild.member(target.id).ban({ reason });
		const infId = await createInfraction(guild.id, "Temp-ban", until, reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModActionTemp(client, guild, "temp-banned", target, moderator, reasonLog, infId, until);

		return infId;
	},

	ForceBan: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.members.ban(target.id, { reason });
		const infId = await createInfraction(guild.id, "Forceban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "force-banned", target, moderator, reasonLog, infId);

		return infId;
	},

	SoftBan: async (client, guild, target, moderator, reason, reasonLog, days) => {
		await guild.member(target.id).ban({ reason, days });
		await guild.members.unban(target.id, reason);

		const infId = await createInfraction(guild.id, "Softban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "softbanned", target, moderator, reasonLog, infId);

		return infId;
	},

	Unban: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.members.unban(target.id, reason);
		const infId = await createInfraction(guild.id, "Unban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "unbanned", target, moderator, reasonLog, infId);

		return infId;
	},

	UnbanTemp: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.members.unban(target.id, reason);
		const infId = await createInfraction(guild.id, "Auto-unban", "true", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendAutoUnban(client, guild, "automatically unbanned", target, moderator, reasonLog, infId);

		return infId;
	},

	Deafen: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.setDeaf(true);
		const infId = await createInfraction(guild.id, "Deafen", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "deafened", target.user, moderator, reasonLog, infId);

		return infId;
	},

	Undeafen: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.setDeaf(false);
		const infId = await createInfraction(guild.id, "Undeafen", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "undeafened", target.user, moderator, reasonLog, infId);

		return infId;
	},

	Voicekick: async (client, guild, target, moderator, reason, reasonLog) => {
		await target.voice.kick();
		const infId = await createInfraction(guild.id, "Voice-kick", "true", reasonLog, target.user.tag, target.user.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "voice-kicked", target.user, moderator, reasonLog, infId);

		return infId;
	},
};

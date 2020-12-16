const { createInfraction } = require("../InfractionUtils");
const { SendModAction } = require("./log");

module.exports = {
	Warn: async () => {},

	Mute: async () => {},

	Kick: async () => {},

	Ban: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.member(target.id).ban({ reason });
		const infId = await createInfraction(guild.id, "Ban", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "Ban", target, moderator, reasonLog, infId);

		return infId;
	},

	ForceBan: async (client, guild, target, moderator, reason, reasonLog) => {
		await guild.members.ban(target.id, { reason });
		const infId = await createInfraction(guild.id, "Forceban", reasonLog, target.tag, target.id, moderator.tag, moderator.id);
		await SendModAction(client, guild, "Forceban", target, moderator, reasonLog, infId);

		return infId;
	},

	SoftBan: async () => {},

	TempBan: async () => {},

	Unban: async () => {},
};

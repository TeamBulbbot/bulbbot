const { createInfraction } = require("../InfractionUtils");

module.exports = {
	Warn: async () => {},

	Mute: async () => {},

	Kick: async () => {},

	Ban: async (guild, target, moderator, reason, reasonLog) => {
		await guild.member(target.id).ban({ reason });
		const infId = await createInfraction(guild.id, "Ban", reasonLog, target.tag, target.id, moderator.tag, moderator.id);

		return infId;
	},

	ForceBan: async (guild, target, moderator, reason, reasonLog) => {
		await guild.members.ban(target.id, { reason });
		const infId = await createInfraction(guild.id, "Forceban", reasonLog, target.tag, target.id, moderator.tag, moderator.id);

		return infId;
	},

	SoftBan: async () => {},

	TempBan: async () => {},

	Unban: async () => {},
};

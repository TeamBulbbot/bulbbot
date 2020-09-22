const Infraction = require("../handlers/Infraction");

module.exports = {
	Warn: async (client, guildId, target, moderator, reason) => {},
	Mute: async (client, guildId, target, moderator, reason) => {},
	// Kick user from guild
	Kick: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);
		if (user.kickable) {
			Infraction.Add(guildId, "Kick", target, moderator.id, reason);
			await user.kick(`Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`);
			return true;
		} else return false;
	},
	// Ban user from guild
	Ban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);

		if (user.bannable) {
			Infraction.Add(guildId, "Ban", target, moderator.id, reason);
			await user.ban({
				reason: `Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});
			return true;
		} else return false;
	},
	// Force ban user from guild
	ForceBan: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);

		try {
			Infraction.Add(guildId, "Force Ban", target, moderator.id, reason);
			await guild.members.ban(target, {
				reason: `Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});
			return true;
		} catch (error) {
			return false;
		}
	},
	// Unban user from guild
	Unban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);

		try {
			Infraction.Add(guildId, "Unban", target.id, moderator.id, reason);
			await guild.members.unban(target, `Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target.id} | Reason: ${reason}`);
			return true;
		} catch (error) {
			return false;
		}
	},
};

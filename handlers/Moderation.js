module.exports = {
	Warn: async (client, guildId, target, moderator, reason) => {},
	Mute: async (client, guildId, target, moderator, reason) => {},
	Kick: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);
		user.kick(`Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`);
	},
	Ban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);
		user.ban({
			reason: `Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
		});
	},
};

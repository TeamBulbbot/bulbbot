const Infraction = require("../handlers/Infraction");
const mongoose = require("mongoose");
const Mute = require("../models/mute");
const clc = require("cli-color");
module.exports = {
	Warn: async (_client, guildId, target, moderator, reason) => {
		Infraction.Add(guildId, "Warn", target, moderator.id, reason);
		return true;
	},
	// Mutes a user from the guild
	Mute: async (
		_client,
		guildId,
		target,
		moderator,
		reason,
		unixDuration,
		duration
	) => {
		const mute = new Mute({
			_id: mongoose.Types.ObjectId(),
			guildID: guildId,
			targetID: target,
			expireTime: unixDuration,
		});
		mute.save().catch((err) => console.error(clc.red(err)));

		Infraction.Add(
			guildId,
			"Mute",
			target,
			moderator.id,
			reason + `\n**Duration:** ${duration}`
		);
		return true;
	},
	// Kick user from guild
	Kick: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);
		if (user.kickable) {
			Infraction.Add(guildId, "Kick", target, moderator.id, reason);
			await user.kick(
				`Kicked by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`
			);
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
				reason: `Banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});
			return true;
		} else return false;
	},
	// Bans and unbans a user from a guild clearing their messages
	Softban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);

		if (user.bannable) {
			Infraction.Add(guildId, "Softban", target, moderator.id, reason);
			await user.ban({
				days: 7,
				reason: `Soft banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});

			await guild.members.unban(
				target,
				`Soft banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target.id} | Reason: ${reason}`
			);
			return true;
		} else return false;
	},
	// Force ban user from guild
	ForceBan: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);

		try {
			Infraction.Add(guildId, "Force Ban", target, moderator.id, reason);
			await guild.members.ban(target, {
				reason: `Forced banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
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
			await guild.members.unban(
				target,
				`Unbanned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target.id} | Reason: ${reason}`
			);
			return true;
		} catch (error) {
			return false;
		}
	},
};

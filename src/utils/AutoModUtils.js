const sequelize = require("./database/connection");
const AutoModException = require("../structures/exceptions/AutoModException");

module.exports = {
	resolveAction: async (message, actions) => {
		for (const action of actions) {
			switch (action.toUpperCase()) {
				case "WARN":
					message.channel.send("Warned this filthy spammer");
					break;
				case "MUTE":
					message.channel.send("Muted this filthy spammer");
					break;
				case "KICK":
					message.channel.send("Kicked this filthy spammer");
					break;
				case "TEMPBAN":
					message.channel.send("Temp-banned this filthy spammer");
					break;
				case "BAN":
					message.channel.send("Banned this filthy spammer");
					break;
				default:
					throw new AutoModException(`'${action}' is not a valid resolvable action!`);
			}
		}
	},

	getInviteWhitelist: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.inviteWhitelist;
	},

	getWordBlacklist: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.wordBlacklist;
	},

	getPunishment: async (guildId, category) => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		switch (category.toUpperCase()) {
			case "INVITE":
				return db.automod.punishmentInvites;
			case "WORDS":
				return db.automod.punishmentWords;
			case "MENTIONS":
				return db.automod.punishmentMentions;
			case "MESSAGES":
				return db.automod.punishmentMessages;
			default: throw new AutoModException(`${category.toUpperCase()} is not a valid AutoMod category`)
		}
	},

	getEnabled: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.enabled;
	},

	getMentionsLimit: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.limitMentions;
	},

	getMessageLimit: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.limitMessages;
	},
};

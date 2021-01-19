const sequelize = require("./database/connection");
const AutoModException = require("../structures/exceptions/AutoModException");

module.exports = {
	resolveAction: async (message, action) => {
		if (action === null) return;

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
	},

	getPunishment: async (guild, category) => {
		switch (category.toUpperCase()) {
			case "WEBSITE":
				return guild.punishmentWebsite;
			case "INVITE":
				return guild.punishmentInvites;
			case "WORDS":
				return guild.punishmentWords;
			case "MENTIONS":
				return guild.punishmentMentions;
			case "MESSAGES":
				return guild.punishmentMessages;
			default:
				throw new AutoModException(`${category} is not a valid AutoMod category`);
		}
	},

	getGuildAutoMod: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod;
	},
};

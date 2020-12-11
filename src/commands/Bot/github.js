const Command = require("../../structures/Command");
const Discord = require("discord.js");
const BulbBotUtils = require("../../utils/BulbBotUtils");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Return a link to the github repository",
			category: "Bot",
			aliases: ["code", "sourcecode"],
			usage: "!github",
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setDescription(BulbBotUtils.translation.translate("github_source_code"))
			.setFooter(BulbBotUtils.translation.translate("global_executed_by", { user: message.author }), message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send(embed);
	}
};

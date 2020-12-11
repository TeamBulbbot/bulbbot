const Command = require("../../structures/Command");
const Discord = require("discord.js");
const BulbBotUtils = require("../../utils/BulbBotUtils");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Returns the license file for the Github repo for the bot",
			category: "Bot",
			usage: "!license",
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setDescription(BulbBotUtils.translation.translate("license_license"))
			.setFooter(BulbBotUtils.translation.translate("global_executed_by", { user: message.author }), message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send(embed);
	}
};

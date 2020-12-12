const Command = require("../../structures/Command");
const Discord = require("discord.js");

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
			.setDescription(this.client.bulbutils.translate("license_license"))
			.setFooter(this.client.bulbutils.translate("global_executed_by", { user: message.author }), message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send(embed);
	}
};

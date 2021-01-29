const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns the privacy policy for the bot",
			category: "Bot",
			usage: "!privacypolicy",
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(this.client.bulbutils.translate("privacy_policy"))
			.setFooter(
				this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns a help article",
			category: "Bot",
			usage: "!commands",
		});
	}

	async run(message) {
		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(await this.client.bulbutils.translate("commands_help"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		message.channel.send(embed)
	}
};

const Command = require("../../structures/Command");
const Discord = require("discord.js");
const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Return the current uptime of the bot",
			category: "Bot",
			usage: "!uptime",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("uptime_uptime", message.guild.id, { uptime: this.client.bulbutils.getUptime(this.client.uptime) }),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

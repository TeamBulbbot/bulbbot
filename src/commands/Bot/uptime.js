const Command = require("../../structures/Command");
const Discord = require("discord.js");
const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Return the current uptime of the bot",
			category: "Bot",
			usage: "!uptime",
		});
	}

	async run(message, args) {
		const time = moment.duration(this.client.uptime, "milliseconds");
		const days = Math.floor(time.asDays());
		const hours = Math.floor(time.asHours() - days * 24);
		const mins = Math.floor(time.asMinutes() - days * 24 * 60 - hours * 60);
		const secs = Math.floor(time.asSeconds() - days * 24 * 60 * 60 - hours * 60 * 60 - mins * 60);

		let uptime = "";
		if (days > 0) uptime += `${days} day(s), `;
		if (hours > 0) uptime += `${hours} hour(s), `;
		if (mins > 0) uptime += `${mins} minute(s), `;
		if (secs > 0) uptime += `${secs} second(s)`;

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(await this.client.bulbutils.translate("uptime_uptime", { uptime }))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

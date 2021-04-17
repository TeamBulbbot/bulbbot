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
		const time = moment.duration(this.client.uptime, "milliseconds");
		const days = Math.floor(time.asDays());
		const hours = Math.floor(time.asHours() - days * 24);
		const mins = Math.floor(time.asMinutes() - days * 24 * 60 - hours * 60);
		const secs = Math.floor(time.asSeconds() - days * 24 * 60 * 60 - hours * 60 * 60 - mins * 60);

		const timeStrings = [];
		if (days > 0) timeStrings.push(`${days} day${days == 1 ? "" : "s"}`);
		if (hours > 0) timeStrings.push(`${hours} hour${hours == 1 ? "" : "s"}`);
		if (mins > 0) timeStrings.push(`${mins} minute${mins == 1 ? "" : "s"}`);
		if (secs > 0) timeStrings.push(`${secs} second${secs == 1 ? "" : "s"}`);
		
		const uptime = (() => { // Dynamic assignment
			const last = timeStrings.pop();
			if(timeStrings.length > 1)
				return timeStrings.join(", ") + ", and " + last;
			else
				timeStrings.push(last);
				return timeStrings.join(" and ")
		})();

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(await this.client.bulbutils.translate("uptime_uptime", message.guild.id, { uptime }))
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

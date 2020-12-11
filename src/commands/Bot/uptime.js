const Command = require("../../structures/Command");
const Discord = require("discord.js");
const BulbBotUtils = require("../../utils/BulbBotUtils");
const moment = require("moment");

module.exports = class extends (
	Command
) {
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
		if (days > 0) uptime += `${days} days, `;
		if (hours > 0) uptime += `${hours} hours, `;
		if (mins > 0) uptime += `${mins} minutes, `;
		if (secs > 0) uptime += `${secs} seconds`;

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setDescription(BulbBotUtils.translation.translate("uptime_uptime", { uptime }))
			.setFooter(BulbBotUtils.translation.translate("global_executed_by", { user: message.author }), message.author.avatarURL({ dynamic: true }))
			.setTimestamp();

		return message.channel.send(embed);
	}
};

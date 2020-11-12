const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

const Translator = require("../../utils/lang/translator");

module.exports = {
	name: "uptime",
	aliases: ["status"],
	category: "botinfo",
	description: "Get the current uptime of the bot",
	usage: "uptime",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: (client, message, _args) => {
		const duration = moment
			.duration(client.uptime)
			.format(" D [days], H [hrs], m [mins], s [secs]");

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setAuthor(
				`${client.user.username}#${client.user.discriminator}`,
				client.user.avatarURL()
			)
			.setTitle(
				Translator.Translate("uptime_current_uptime", { uptime: duration })
			);

		return message.channel.send(embed);
	},
};

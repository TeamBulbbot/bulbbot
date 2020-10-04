const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
	name: "uptime",
	aliases: ["status"],
	category: "botinfo",
	description: "Get the current uptime of the bot",
	usage: "uptime",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	run: async (client, message, _args) => {
		let duration = moment
			.duration(client.uptime)
			.format(" D [days], H [hrs], m [mins], s [secs]");

		let embed = new Discord.MessageEmbed()
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
			.setTitle(`Current uptime: ${duration}`);

		return message.channel.send(embed);
	},
};

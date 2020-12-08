const Discord = require("discord.js");

module.exports = {
	name: "ping",
	aliases: ["🏓"],
	category: "botinfo",
	description: "Returns bot and API latency in milliseconds.",
	usage: "ping",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: (client, message, _args) => {
		const latency = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency = Math.round(client.ws.ping);

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTitle("🏓 Pong!")
			.setDescription(
				`Bot Latency is **${latency} ms** \nAPI Latency is **${apiLatency} ms**`
			)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			);

		return message.channel.send(embed);
	},
};

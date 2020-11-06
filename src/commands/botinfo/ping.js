const Discord = require("discord.js");

module.exports = {
	name: "ping",
	aliases: ["🏓"],
	category: "botinfo",
	description: "Returns bot and API latency in milliseconds.",
	usage: "ping",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [""],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTitle("🏓 Pong!")
			.setDescription(
				`Bot Latency is **${Math.floor(
					new Date().getTime() - message.createdTimestamp
				)} ms** \nAPI Latency is **${Math.round(
					client.ws.ping
				)} ms**\nWebsocket Latency is **${Math.round(
					message.guild.shard.ping
				)} ms**`
			)
			.setTimestamp();
		message.channel.send(embed);
	},
};

const Discord = require("discord.js");
var os = require("os");

module.exports = {
	name: "analytics",
	category: "developer",
	description: "Analytics about the bot",
	usage: "analytics",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		let developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			let totalGuildSize = client.guilds.cache.size;

			const list = client.guilds.cache;
			let totalMemberCount = 0;
			list.forEach((guild) => {
				totalMemberCount += guild.memberCount;
			});

			let embed = new Discord.MessageEmbed()
				.setTimestamp()
				.setFooter(
					`Executed by ${message.author.username}#${message.author.discriminator}`,
					message.author.avatarURL()
				)
				.setColor(process.env.COLOR)

				.addField(
					"Guilds & Users",
					`
        **Guild count:** ${totalGuildSize}
        **Member Count:** ${totalMemberCount}
        `,
					true
				)
				.addField("Discord.JS", `**Version:** ${Discord.version}`, true)
				.addField(
					"RAM",
					`**Used:** ${((os.totalmem() - os.freemem()) / 1073741824).toFixed(
						3
					)} GB\n**Free:** ${(os.freemem() / 1073741824).toFixed(
						3
					)} GB\n**Total:** ${(os.totalmem() / 1073741824).toFixed(3)} GB`,
					true
				)
				.addField(
					"Host",
					`**Hostname:** ${os.hostname()}\n**Platform:** ${os.platform()}\n**Release:** ${os.release()}\n**Uptime:** ${(
						os.uptime() /
						60 /
						60
					).toFixed(0)} hours`,
					true
				);

			return message.channel.send(embed);
		}
	},
};

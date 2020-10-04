const Discord = require("discord.js");

module.exports = {
	name: "analytics",
	category: "developer",
	description: "Analytics about the bot",
	usage: "analytics",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
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
					"Guild & Users",
					`
        **Guild count:** ${totalGuildSize}
        **Member Count:** ${totalMemberCount}
        `,
					true
				);

			return message.channel.send(embed);
		}
	},
};

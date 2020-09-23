const Discord = require("discord.js");

module.exports = {
	name: "help",
	category: "botinfo",
	description: "Helper",
	run: async (client, message, args) => {
		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setThumbnail(client.user.avatarURL())
			.setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
			.setAuthor(`Help ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL());
		client.commands.forEach((c) => {
			if (c.category !== "developer") {
				embed.addField(`${c.name} \`\`(${c.category})\`\``, `> **Aliases:** ${c.aliases > 0 ? c.aliases.join("|") : c.aliases}\n> **Description**: ${c.description}`);
			}
		});

		return message.channel.send(embed);
	},
};

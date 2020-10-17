const Discord = require("discord.js");

function field(embed, name, category, aliases, description, usage) {
	embed.setDescription(`

  \`\`|\`\` **=** Aliases
  \`\`<>\`\` **=** Arugment is required
  \`\`[]\`\` **=** Argument is optional
  \`\`<user>\`\` **=** The user id or a mention

  `);
	return embed.addField(
		`${name} `, // \`\`(${category})\`\`
		` \n> **Usage:** ${usage}${
			aliases > 0
				? `\n> **Aliases:** ${aliases.join(" **|** ")}`
				: aliases === undefined
				? ""
				: `\n> **Aliases:** ${aliases.join(" **|** ")}`
		}\n> **Description**: ${description}`
	);
}

module.exports = {
	name: "help",
	category: "botinfo",
	description:
		"Super basic helper command so people know which commands exists",
	usage: "help <section>",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	run: async (client, message, args) => {
		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setThumbnail(client.user.avatarURL())
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setTimestamp()
			.setAuthor(
				`Help ${client.user.username}#${client.user.discriminator}`,
				client.user.avatarURL()
			);

		switch (args[0]) {
			case "bot":
			case "botinfo":
				client.commands.forEach((c) => {
					if (c.category === "botinfo")
						field(embed, c.name, c.category, c.aliases, c.description, c.usage);
				});

				break;

			case "config":
			case "configuration":
				client.commands.forEach((c) => {
					if (c.category === "configuration")
						field(embed, c.name, c.category, c.aliases, c.description, c.usage);
				});
				break;

			case "info":
			case "information":
				client.commands.forEach((c) => {
					if (c.category === "information")
						field(embed, c.name, c.category, c.aliases, c.description, c.usage);
				});
				break;

			case "misc":
			case "miscellaneous":
				client.commands.forEach((c) => {
					if (c.category === "miscellaneous")
						field(embed, c.name, c.category, c.aliases, c.description, c.usage);
				});
				break;

			case "mod":
			case "moderation":
				client.commands.forEach((c) => {
					if (c.category === "moderation")
						field(embed, c.name, c.category, c.aliases, c.description, c.usage);
				});
				break;

			default:
				embed.setTitle("Missing help section");
				embed.addField("🤖 ``bot``", "Bot commands", true);
				embed.addField("🛠️ ``config``", "Configuration commands", true);
				embed.addField("🌐 ``info``", "Information commands", true);
				embed.addField("🎉 ``misc``", "Miscellaneous commands", true);
				embed.addField("🔨 ``mod``", "Moderation commands", true);

				break;
		}

		return message.channel.send(embed);
	},
};

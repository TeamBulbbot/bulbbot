const Discord = require("discord.js");

module.exports = {
	name: "help",
	category: "botinfo",
	description: "Super basic helper command so people know which commands exists",
	run: async (client, message, _args) => {
		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setThumbnail(client.user.avatarURL())
			.setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
			.setAuthor(`Help ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL()).setDescription(`
			**Usage of commands**
			\`\`prefix\`\` (default \`\`!\`\`) \`\`commandname\`\` \`\`arguments\`\`
			| = Aliases
			<> = Arugment is required
			[] = Argument is optional
			
			`);
		client.commands.forEach((c) => {
			if (c.category !== "developer") {
				embed.addField(`${c.name} \`\`(${c.category})\`\``, ` ${c.aliases > 0 ? `> **Aliases:** ${c.aliases.join("**|**")}` : c.aliases === undefined ? "" : `> **Aliases:** ${c.aliases.join("**|**")}`}\n> **Description**: ${c.description}`);
			}
		});

		return message.channel.send(embed);
	},
};

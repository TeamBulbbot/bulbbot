const Discord = require("discord.js");
const Guild = require("../../models/guild");
const Emotes = require("../../emotes.json");
const Logger = require("../../utils/other/winston");

module.exports = {
	name: "overrides",
	category: "configuration",
	description: "Returns bot and API latency in milliseconds.",
	usage: "overrides <category>",
	clientPermissions: [
		"EMBED_LINKS",
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"USE_EXTERNAL_EMOJIS",
	],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override <category>\`\`\n**List of categorys:** \`\`command\`\`, \`\`role\`\``
			);
		switch (args[0].toLowerCase()) {
			case "command":
			case "commands":
				Guild.findOne(
					{
						guildID: message.guild.id,
					},
					async (err, guild) => {
						if (err) Logger.error(err);

						let desc = ``;

						guild.overrideCommands.forEach((c) => {
							desc += emotify(c.enabled);
							desc += ` - \`\`${c.commandName}\`\` with a clearance level of \`\`${c.clearanceLevel}\`\`\n`;
						});

						const embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setFooter(
								`Executed by ${message.author.username}#${message.author.discriminator}`,
								message.author.avatarURL()
							)
							.setTitle("List of command overrides")
							.setDescription(desc);

						return message.channel.send(embed);
					}
				);
				break;
			case "role":
			case "roles":
				Guild.findOne(
					{
						guildID: message.guild.id,
					},
					async (err, guild) => {
						if (err) Logger.error(err);

						let desc = ``;

						guild.moderationRoles.forEach((r) => {
							desc += `<@&${r.roleId}> \`\`(${r.roleId})\`\` with a clearance level of \`\`${r.clearanceLevel}\`\`\n`;
						});

						const embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setFooter(
								`Executed by ${message.author.username}#${message.author.discriminator}`,
								message.author.avatarURL()
							)
							.setTitle("List of role overrides")
							.setDescription(desc);

						return message.channel.send(embed);
					}
				);
				break;
			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override <category>\`\`\n**List of categorys:** \`\`command\`\`, \`\`role\`\``
				);
				break;
		}
	},
};

function emotify(text) {
	if (text) return `${Emotes.other.switchOn} Enabled`;
	else return `${Emotes.other.switchOff} Disabled`;
}

const clc = require("cli-color");

const Guild = require("../../models/guild");
const Log = require("../../models/log");
const Role = require("../../models/role");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "guild",
	aliases: ["guildconfig", "guilddata"],
	category: "configuration",
	description: "Get the configuration list of the guild",
	usage: "guild",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("MANAGE_GUILD"))
			return message.channel.send(":lock: Missing permission ``MANAGE_GUILD``"); // I know best has permssion lol

		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`part\`\`\n${Emotes.other.tools} Correct usage of command: \`\`guild|guildconfig|guilddata <part>\`\``
			);
		const part = args[0].toLowerCase();

		switch (part) {
			case "guild":
				Guild.findOne(
					{
						guildID: message.guild.id,
					},
					(err, guild) => {
						if (err) console.error(clc.red(err));
						let msg = `${Emotes.other.tools} All guild data we store on **${message.guild.name}**\n`;

						msg += `**Guild ID:** ${guild.guildID}\n`;
						msg += `**Guild Name:** ${guild.guildName}\n`;
						msg += `**Guild Prefix:** ${guild.guildPrefix}\n`;
						msg += `**Track Analytics:** ${guild.trackAnalytics}\n`;
						msg += `**Join Date:** ${guild.joinDate}\n`;

						message.channel.send(msg);
					}
				);

				break;
			case "log":
				Log.findOne(
					{
						guildID: message.guild.id,
					},
					(err, guild) => {
						if (err) console.error(clc.red(err));
						let msg = `${Emotes.other.tools} All logging data we store on **${message.guild.name}**\n`;

						msg += `**Guild ID:** ${guild.guildID} \n`;
						msg += `**Mod Actions:** ${guild.modAction} <#${guild.modAction}>\n`;
						msg += `**Message logs:** ${guild.message} <#${guild.message}>\n`;
						msg += `**Role logs:** ${guild.role} <#${guild.role}>\n`;
						msg += `**Member logs:** ${guild.member} <#${guild.member}>\n`;
						msg += `**Channel logs:** ${guild.channel} <#${guild.channel}>\n`;
						msg += `**Join leave log:** ${guild.join_leave} <#${guild.join_leave}>\n`;

						message.channel.send(msg);
					}
				);

				break;
			case "role":
				Role.findOne(
					{
						guildID: message.guild.id,
					},
					(err, guild) => {
						if (err) console.error(clc.red(err));
						let msg = `${Emotes.other.tools} All role data we store on **${message.guild.name}**\n`;

						msg += `**Guild ID:** ${guild.guildID}\n`;
						msg += `**Admin:** ${guild.admin}\n`;
						msg += `**Moderator:** ${guild.moderator}\n`;
						msg += `**Muted:** ${guild.mute}\n`;

						message.channel.send(msg);
					}
				);

				break;

			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`part\`\`\n${Emotes.other.tools} Correct usage of command: \`\`guild|guildconfig|guilddata <part>\`\`\n**Parts:** \`\`guild\`\`, \`\`log\`\`, \`\`role\`\``
				);
				break;
		}
	},
};

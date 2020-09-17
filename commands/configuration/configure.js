const Discord = require("discord.js");
const Guild = require("../../handlers/configuration/guild");
const Log = require("../../handlers/configuration/logs");
const Role = require("../../handlers/configuration/roles");
const Setting = require("../../handlers/configuration/settings");

module.exports = {
	name: "configure",
	aliases: ["cfg", "setting", "config"],
	category: "configuration",
	description: "Modify settings on the bot in your guild",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(":lock: Missing permission ``MANAGE_SERVER``");
		if (args[0] === undefined || args[0] === null || args[1] === null || args[1] === null) return message.channel.send("🤣  lmao mate you forgot something");

		const setting = args[0].toLowerCase();
		const newValue = args[1];

		switch (setting) {
			// Guild configuration
			case "prefix": // Change the bot prefix
				Guild.Change_Prefix(message.guild.id, newValue);
				message.channel.send(`Successfully updated the prefix to \`\`${newValue}\`\` in **${message.guild.name}**`);
				break;

			// Log configuration
			case "mod_action":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "message":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "role":
			case "role_update":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "member_update":
			case "member":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "channel_update":
			case "channel":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "join_leave":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;

			// Role configuration
			case "admin":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "mod":
			case "moderator":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "mute":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "trusted":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;

			// Setting configuration
			case "lang":
			case "language":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "delete_server_invites":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "trusted_server_invites":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "allow_non_latin_usernames":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "dm_on_action":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "censored_words":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "delete_links":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			case "trusted_links":
				message.channel.send(`\`\`${newValue}\`\` in **${message.guild.name}**`);
				break;
			default:
				break;
		}
	},
};

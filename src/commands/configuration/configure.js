const Guild = require("../../utils/configuration/guild");
const Log = require("../../utils/configuration/logs");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "configure",
	aliases: ["cfg", "setting", "config"],
	category: "configuration",
	description: "Modify settings on the bot in your guild",
	usage: "configure <setting> <new value>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	clearanceLevel: 75,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`setting\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value> | If you want to disable a command put disable inside of the <new value>\`\``
			);
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`new value\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value> | If you want to disable a command put disable inside of the <new value>\`\``
			);
		const setting = args[0].toLowerCase();
		const newValue = args[1];

		switch (setting) {
			// Guild configuration
			case "prefix": // Change the bot prefix
				Prefix(message, newValue);
				break;

			case "track_analytics":
				Track_analytics(message, newValue);
				break;

			// Log configuration
			case "mod_action":
				Mod_action(client, message, newValue);
				break;
			case "message":
				Message(client, message, newValue);
				break;
			case "role":
			case "role_update":
				Role_update(client, message, newValue);
				break;
			case "member":
			case "member_update":
				Member_update(client, message, newValue);
				break;
			case "channel":
			case "channel_update":
				Channel_update(client, message, newValue);
				break;
			case "join_leave":
				Join_leave(client, message, newValue);
				break;

			// Setting configuration
			case "lang":
			case "language":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "delete_server_invites":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "trusted_server_invites":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "allow_non_latin_usernames":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "dm_on_action":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "censored_words":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "delete_links":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;
			case "trusted_links":
				message.channel.send(
					`\`\`${newValue}\`\` in **${message.guild.name}**`
				);
				break;

			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`setting\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value> | If you want to disable command put disable inside of the <new value>\`\`\n**Guild settings:** \`\`prefix\`\`, \`\`track_analytics\`\`\n**Logging settings:** \`\`mod_action\`\`, \`\`message\`\`, \`\`role|role_update\`\`, \`\`member|member_update\`\`, \`\`channel|channel_update\`\`, \`\`join_leave\`\`\n**Role settings:** \`\`admin\`\`, \`\`mod|moderator\`\`, \`\`mute\`\`, \`\`trusted\`\`\n**Settings:** \`\`lang|language\`\`, \`\`delete_server_invites\`\`, \`\`trusted_server_invites\`\`, \`\`allow_non_latin_usernames\`\`, \`\`dm_on_action\`\`, \`\`censored_words\`\`, \`\`delete_links\`\`, \`\`trusted_links\`\``
				);
				break;
		}
	},
};

// Helper functions
function isChannel(message, channel) {
	return (
		message.guild.channels.cache.get(channel.replace(/\D/g, "")) !== undefined
	);
}

// Guild configuration
function Prefix(message, newValue) {
	Guild.Change_Prefix(message.guild.id, newValue);
	message.channel.send(
		`Successfully updated the prefix to \`\`${newValue}\`\` in **${message.guild.name}**`
	);
}

function Track_analytics(message, newValue) {
	if (newValue === "true" || newValue === "false") {
		Guild.Track_Analytics(message.guild.id, newValue);
		message.channel.send(
			`Successfully update the state of tracking analytics to  \`\`${newValue}\`\` in **${message.guild.name}**`
		);
	} else
		message.channel.send("Invalid value, allowed values ``true`` or ``false``");
}

// Logging configuration
function Mod_action(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`mod actions\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`mod actions\`\` in ${newValue} in **${message.guild.name}**`
		);
	}
	Log.Change_Mod_Action(client, message.guild.id, newValue.replace(/\D/g, ""));
}

function Message(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`message\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`message\`\` in ${newValue} in **${message.guild.name}**`
		);
	}

	Log.Change_Message(client, message.guild.id, newValue);
}

function Role_update(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`role updates\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`role updates\`\` in ${newValue} in **${message.guild.name}**`
		);
	}

	Log.Change_Role(client, message.guild.id, newValue.replace(/\D/g, ""));
}

function Member_update(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`member updates\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`member updates\`\` in ${newValue} in **${message.guild.name}**`
		);
	}

	Log.Change_Member(client, message.guild.id, newValue.replace(/\D/g, ""));
}

function Channel_update(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`channel updates\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`channel updates\`\` in ${newValue} in **${message.guild.name}**`
		);
	}

	Log.Change_Channel(client, message.guild.id, newValue.replace(/\D/g, ""));
}

function Join_leave(client, message, newValue) {
	if (newValue === "disable") {
		newValue = "";
		message.channel.send(
			`Stopped logging \`\`join leave\`\` in **${message.guild.name}**`
		);
	} else if (!isChannel(message, newValue))
		return message.channel.send(
			`${Emotes.actions.warn} Invalid \`\`channel\`\``
		);
	else {
		newValue = newValue.replace(/\D/g, "");
		message.channel.send(
			`Now logging \`\`join leave\`\` in ${newValue} in **${message.guild.name}**`
		);
	}

	Log.Change_Join_Leave(client, message.guild.id, newValue.replace(/\D/g, ""));
}

import BulbBotClient from "../structures/BulbBotClient";
import { ApplicationCommand, ApplicationCommandOptionTypes, ApplicationCommandOptionsChannelTypes, ApplicationCommandType } from "./types/ApplicationCommands";
import { discordApi, developerGuild } from "../Config";
import axios from "axios";

export async function registerSlashCommands(client: BulbBotClient) {
	const isDev = process.env.ENVIRONMENT === "dev";

	const options: any = {
		method: "PUT",
		url: `${discordApi}/applications/${client.user?.id}/${isDev ? `guilds/${developerGuild}/` : ""}commands`,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${process.env.TOKEN}`,
		},
		data: [...ChatInputCommand, ...UserCommand, ...MessageCommand],
	};

	try {
		const response = await axios.request(options);
		client.log.info(`[APPLICATION COMMANDS] Registered all of the slash commands, amount: ${response.data.length}`);
	} catch (err: any) {
		client.log.error(`[APPLICATION COMMANDS] Failed to register slash commands: ${err}`);
	}
}

export const ChatInputCommand: ApplicationCommand[] = [
	{
		name: "about",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns more information about the bot",
	},
	{
		name: "commands",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Return a list of all available commands for Bulbbot",
	},
	{
		name: "github",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the GitHub repository link",
	},
	{
		name: "help",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Gets useful information about the provided command",
		options: [
			{
				name: "command",
				description: "The command you want to get more information for",
				type: ApplicationCommandOptionTypes.STRING,
				required: true,
			},
		],
	},
	{
		name: "invite",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the invite link for the bot and the support server",
	},
	{
		name: "license",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the license file for the Github repo for the bot",
	},
	{
		name: "ping",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the API and WebSocket latency",
	},
	{
		name: "privacypolicy",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the Privacy Policy for the bot",
	},
	{
		name: "uptime",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns the current uptime of the bot",
	},

	{
		name: "channelinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns information about the channel",
		options: [
			{
				name: "channel",
				description: "The channel you want to get information about",
				type: ApplicationCommandOptionTypes.CHANNEL,
				required: true,
			},
		],
	},
	{
		name: "charinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns information about the characters provided",
		options: [
			{
				name: "string",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The characters you want to info",
				required: true,
			},
		],
	},
	{
		name: "inviteinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns some useful info about a server from the invite link",
		options: [
			{
				name: "invite",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The invite link of the server you want to info",
				required: true,
			},
		],
	},
	{
		name: "messageinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns information about the message provided",
		options: [
			{
				name: "message",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The message you want to get info about",
				required: true,
			},
		],
	},
	{
		name: "roleinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns information about the role provided",
		options: [
			{
				name: "role",
				type: ApplicationCommandOptionTypes.ROLE,
				description: "The role you want to get info about",
				required: true,
			},
		],
	},
	{
		name: "server",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns some useful information about the current server",
	},
	{
		name: "userinfo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Returns some useful info about a user",
		options: [
			{
				name: "user",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user you want to info",
				required: false,
			},
		],
	},

	{
		name: "banpool",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Banpool main command",
		options: [
			{
				name: "create",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Creates a banpool",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The banpool name",
						required: true,
					},
				],
			},
			{
				name: "delete",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Deletes the selected banpool",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The name of the banpool that should be deleted",
						required: true,
					},
				],
			},
			{
				name: "info",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Returns information about the selected banpool",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The name of the banpool that should be info'd",
						required: true,
					},
				],
			},
			{
				name: "invite",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Creates a one-time invite for the selected banpool",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "Name of the selected banpool",
						required: true,
					},
				],
			},
			{
				name: "join",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Joins the selected banpool",
				options: [
					{
						name: "code",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The invite code of that banpool that you want to join",
						required: true,
					},
				],
			},
			{
				name: "leave",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Leaves the selected banpool",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "Name of the banpool that you want to leave",
						required: true,
					},
				],
			},
			{
				name: "list",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Gets a list of bannpools the server is connected to",
			},
			{
				name: "kick",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Kicks the selected server from the selected banpool",
				options: [
					{
						name: "guild_id",
						type: ApplicationCommandOptionTypes.STRING,
						description: "ID of the selected server",
						required: true,
					},
					{
						name: "name",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The name of the selected banpool",
						required: true,
					},
				],
			},
		],
	},
	{
		name: "configure",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Configure main command",
	},
	{
		name: "settings",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Get the settings for the server",
	},
	{
		name: "messageclear",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Clears X amount of messages from the database in the server",
		options: [
			{
				name: "days",
				type: ApplicationCommandOptionTypes.INTEGER,
				description: "The amount of days of messages to clear",
				required: true,
			},
		],
	},

	{
		name: "avatar",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Gets a users avatar picture",
		options: [
			{
				name: "user",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user who's avatar you want to retrieve",
				required: false,
			},
		],
	},
	{
		name: "id",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Parses Discord IDs from the provided text",
		options: [
			{
				name: "text",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The text you want to parse Discord IDs from",
				required: true,
			},
		],
	},
	{
		name: "remind",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Reminder main command",
		options: [
			{
				name: "list",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Returns a list of all your current active reminders",
			},
			{
				name: "remove",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Removes the selected reminder",
				options: [
					{
						name: "reminder",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The ID of the reminder you want to remove",
						required: true,
					},
				],
			},
			{
				name: "set",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Sets a reminder",
				options: [
					{
						name: "duration",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The duration after which you should receive the reminder",
						required: true,
					},
					{
						name: "reminder",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The reminder message",
						required: true,
					},
				],
			},
		],
	},
	{
		name: "jumbo",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Sends a bigger version of the given emote(s)",
		options: [
			{
				name: "emojis",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The emoji(s) you want to return in their jumbo version",
				required: true,
			},
		],
	},
	{
		name: "permissions",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Gets permission names from a permission number",
		options: [
			{
				name: "permissions",
				type: ApplicationCommandOptionTypes.INTEGER,
				description: "The permission number",
				required: true,
			},
		],
	},

	{
		name: "archive",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Archive commands",
		options: [
			{
				name: "channel",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Archive a channel",
				options: [
					{
						name: "channel",
						type: ApplicationCommandOptionTypes.CHANNEL,
						description: "The channel to archive",
						required: true,
						channel_types: [
							ApplicationCommandOptionsChannelTypes.GUILD_NEWS,
							ApplicationCommandOptionsChannelTypes.GUILD_NEWS_THREAD,
							ApplicationCommandOptionsChannelTypes.GUILD_PRIVATE_THREAD,
							ApplicationCommandOptionsChannelTypes.GUILD_PUBLIC_THREAD,
							ApplicationCommandOptionsChannelTypes.GUILD_TEXT,
						],
					},
				],
			},
			{
				name: "user",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Archive a user",
				options: [
					{
						name: "user",
						type: ApplicationCommandOptionTypes.USER,
						description: "The user to archive",
						required: true,
					},
				],
			},
		],
	},

	{
		name: "ban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Bans or forcebans a user from the server",
		options: [
			{
				name: "user",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user that should be banned",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the ban",
				required: false,
			},
		],
	},
	{
		name: "cleanban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Bans a user and removes all their contexts from the server",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be banned",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the ban",
				required: false,
			},
		],
	},
	{
		name: "crossban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Cross-bans the selected user from all connected banpools",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user that should be cross-banned from all connected banpools",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason for the ban",
				required: true,
			},
		],
	},
	{
		name: "deafen",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Deafens a member from a Voice Channel they're connected to",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be deafened",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the deafen",
				required: false,
			},
		],
	},
	{
		name: "infraction",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Manages a given users infractions",
		options: [
			{
				name: "claim",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Claim responsibility over the provided infraction",
				options: [
					{
						name: "infraction",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The infraction ID",
						required: true,
					},
				],
			},
			{
				name: "info",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Returns more information about the provided information",
				options: [
					{
						name: "infraction",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The infraction ID",
						required: true,
					},
				],
			},
			{
				name: "modsearch",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Searches the database for any infractions where the provided user is the moderator",
				options: [
					{
						name: "user",
						type: ApplicationCommandOptionTypes.USER,
						description: "The user that should be used as a query",
						required: true,
					},
				],
			},
			{
				name: "offendersearch",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Searches the database for infractions where the selected user is marked as the offender",
				options: [
					{
						name: "user",
						type: ApplicationCommandOptionTypes.USER,
						description: "The user that should be used as a query",
						required: true,
					},
				],
			},
			{
				name: "remove",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Removes the selected infraction from the database",
				options: [
					{
						name: "infraction",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The infraction ID",
						required: true,
					},
				],
			},
			{
				name: "search",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Searches the database for any infractions where the selected user is the moderator or offender",
				options: [
					{
						name: "user",
						type: ApplicationCommandOptionTypes.USER,
						description: "The user that should be used as the query",
						required: true,
					},
				],
			},
			{
				name: "update",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Updates the selected infraction with the new provided reason",
				options: [
					{
						name: "infraction",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The ID of the infraction that should be updated",
						required: true,
					},
					{
						name: "reason",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The new updated reason behind the infraction",
						required: true,
					},
				],
			},
		],
	},
	{
		name: "kick",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Kicks the selected member from the server",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be kicked",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the kick",
				required: false,
			},
		],
	},
	{
		name: "lockdown",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Locks/unlocks a selected channel",
		options: [
			{
				name: "channel",
				type: ApplicationCommandOptionTypes.CHANNEL,
				description: "The channel that should be locked/unlocked",
				required: true,
				channel_types: [
					ApplicationCommandOptionsChannelTypes.GUILD_NEWS,
					ApplicationCommandOptionsChannelTypes.GUILD_NEWS_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_PRIVATE_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_PUBLIC_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_TEXT,
				],
			},
			{
				name: "locked",
				type: ApplicationCommandOptionTypes.BOOLEAN,
				description: "Whether the channel should be locked or not",
				required: true,
			},
		],
	},
	{
		name: "multiban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Bans or forcebans multiple people from a server",
		options: [
			{
				name: "users",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The users that should be banned separated by a space",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the ban",
				required: false,
			},
		],
	},
	{
		name: "multikick",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Kicks multiple people from a server",
		options: [
			{
				name: "users",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The users that should be kicked separated by a space",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the kick",
				required: false,
			},
		],
	},
	{
		name: "multiunban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Unbans multiple people from a server",
		options: [
			{
				name: "users",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The users that should be unbanned separated by a space",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the unban",
				required: false,
			},
		],
	},
	{
		name: "multiwarn",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Warns multiple selected users",
		options: [
			{
				name: "users",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The users that should be warned separated by a space",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the warn",
				required: false,
			},
		],
	},
	{
		name: "mute",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Mutes the selected user for the specified amount of time",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be muted",
				required: true,
			},
			{
				name: "duration",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The duration for which the should be muted for",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the mute",
				required: false,
			},
		],
	},
	{
		name: "nickname",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Nicknames a user from the current server",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be nicknamed",
				required: true,
			},
			{
				name: "nickname",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The selected user's new nickname",
				required: false,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the nickname change",
				required: false,
			},
		],
	},
	{
		name: "prune",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Prune users from the server",
		options: [
			{
				name: "days",
				type: ApplicationCommandOptionTypes.NUMBER,
				description: "How many days to prune from",
				required: true,
			},
			{
				name: "roles",
				type: ApplicationCommandOptionTypes.STRING,
				description: "Roles to include in the prune",
				required: false,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "Reason for the prune",
				required: false,
			},
		],
	},
	{
		name: "purge",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Purge main command",
		options: [
			{
				name: "all",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages in the given channel",
				options: [
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "between",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges all messages between the two given messages",
				options: [
					{
						name: "message1",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The first message",
						required: true,
					},
					{
						name: "message2",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The second message",
						required: true,
					},
				],
			},
			{
				name: "bots",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages sent from bot users",
				options: [
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "contains",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages containing the provided query",
				options: [
					{
						name: "query",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The query that the fetched messages must have",
						required: true,
					},
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "embeds",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages if the message contains an embed",
				options: [
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "emojis",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages if the message contains an emoji",
				options: [
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "images",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages if the message contains an image",
				options: [
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
			{
				name: "until",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges messages until a message",
				options: [
					{
						name: "message",
						type: ApplicationCommandOptionTypes.STRING,
						description: "The message to purge until",
						required: true,
					},
				],
			},
			{
				name: "user",
				type: ApplicationCommandOptionTypes.SUB_COMMAND,
				description: "Purges the selected amount of messages from the selected member",
				options: [
					{
						name: "member",
						type: ApplicationCommandOptionTypes.USER,
						description: "The user who's messages should be purged",
						required: true,
					},
					{
						name: "amount",
						type: ApplicationCommandOptionTypes.INTEGER,
						description: "The amount of messages that should be fetched from the last sent message",
						required: true,
					},
				],
			},
		],
	},
	{
		name: "slowmode",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Sets a slowmode to the selected channel",
		options: [
			{
				name: "duration",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The duration the slowmode should be set to",
				required: true,
			},
			{
				name: "channel",
				type: ApplicationCommandOptionTypes.CHANNEL,
				description: "The channel where the slowmode should be edited",
				required: false,
				channel_types: [
					ApplicationCommandOptionsChannelTypes.GUILD_NEWS,
					ApplicationCommandOptionsChannelTypes.GUILD_NEWS_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_PRIVATE_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_PUBLIC_THREAD,
					ApplicationCommandOptionsChannelTypes.GUILD_TEXT,
				],
			},
		],
	},
	{
		name: "softban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Bans and immediately unbans the selected member from the server",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user that should be soft-banned",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the soft-ban",
				required: false,
			},
		],
	},
	{
		name: "tempban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Temporarily bans the selected member from the server",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be temp-banned",
				required: true,
			},
			{
				name: "duration",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The duration the selected user should be banned for",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the tempban",
				required: false,
			},
		],
	},
	{
		name: "unban",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Unban a user from the server",
		options: [
			{
				name: "user",
				type: ApplicationCommandOptionTypes.USER,
				description: "The user that should be unbanned",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the unban",
				required: false,
			},
		],
	},
	{
		name: "undeafen",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Undeafens a member from a Voice Channel they're connected to",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be undeafened",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the undeafen",
				required: false,
			},
		],
	},
	{
		name: "unmute",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Unmutes the selected member",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be unmuted",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the unmute",
				required: false,
			},
		],
	},
	{
		name: "verification",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Changes the server verification level",
		options: [
			{
				name: "level",
				type: ApplicationCommandOptionTypes.INTEGER,
				description: "The desired verification level",
				choices: [
					{
						name: "NONE",
						value: 0,
					},
					{
						name: "LOW",
						value: 1,
					},
					{
						name: "MEDIUM",
						value: 2,
					},
					{
						name: "HIGH",
						value: 3,
					},
					{
						name: "VERY_HIGH",
						value: 4,
					},
				],
				required: true,
			},
		],
	},
	{
		name: "warn",
		type: ApplicationCommandType.CHAT_INPUT,
		description: "Warns the selected server member",
		options: [
			{
				name: "member",
				type: ApplicationCommandOptionTypes.USER,
				description: "The member that should be warned",
				required: true,
			},
			{
				name: "reason",
				type: ApplicationCommandOptionTypes.STRING,
				description: "The reason behind the warning",
				required: false,
			},
		],
	},
];

export const UserCommand: ApplicationCommand[] = [];

export const MessageCommand: ApplicationCommand[] = [
	{
		name: "Warn",
		type: ApplicationCommandType.MESSAGE,
		description: "",
	},
	{
		name: "Quick Mute (1h)",
		type: ApplicationCommandType.MESSAGE,
		description: "",
	},
	{
		name: "List all Infractions",
		type: ApplicationCommandType.MESSAGE,
		description: "",
	},
	{
		name: "Clean All Messages",
		type: ApplicationCommandType.MESSAGE,
		description: "",
	},
];

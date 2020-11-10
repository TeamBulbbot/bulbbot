const Discord = require("discord.js");
const { Permissions } = require("discord.js");

const Guild = require("../models/guild");
const GuildUtils = require("../utils/database/guild");
const Commandtils = require("../utils/database/command");
const Logger = require("../utils/other/winston");
const Translator = require("../utils/lang/translator")

module.exports = async (client, message) => {
	if (message.author.bot) return;

	if (message.channel.type === "dm") {
		const webhookClient = new Discord.WebhookClient(
			process.env.WEBHOOK_ID,
			process.env.WEBHOOK_TOKEN
		);

		webhookClient.send(
			`**User ID:** ${message.author.id}\n**Content:** ${message.content}`,
			{
				username: `${message.author.username}#${message.author.discriminator}`,
				avatarURL: message.author.avatarURL(),
			}
		);

		return;
	}

	Guild.findOne(
		{
			guildID: message.guild.id,
		},
		async (err, guild) => {
			if (err) Logger.error(err);
			if (guild == null) GuildUtils.Add(message.guild);

			let prefix;
			try {
				prefix = guild.guildPrefix;
			} catch (error) {
				prefix = process.env.PREFIX;
			}

			if (
				message.content === `<@${client.user.id}>` ||
				message.content === `<@!${client.user.id}>`
			)
				return message.channel.send(
					`Hi, the current prefix in **${message.guild.name}** is \`\`${prefix}\`\``
				);

			if (!message.guild) return;
			if (!message.content.startsWith(prefix)) return;
			if (!message.member)
				message.member = await message.guild.fetchMember(message);

			const args = message.content.slice(prefix.length).trim().split(/ +/g);
			const cmd = args.shift().toLowerCase();

			if (cmd.length === 0) return;

			let command = client.commands.get(cmd);
			if (!command) command = client.commands.get(client.aliases.get(cmd));

			if (command) {
				// Handle override commands
				let clearanceLevel = command.clearanceLevel;
				let cOverride = guild.overrideCommands.filter(function (c) {
					return c.commandName == command.name;
				});

				if (cOverride.length !== 0) {
					if (!cOverride[0].enabled) return;
					clearanceLevel = cOverride[0].clearanceLevel;
				}

				// Handle users
				let authorClearance = 0;
				if (message.author.id === message.guild.ownerID) authorClearance = 100;
				if (message.member.hasPermission("ADMINISTRATOR")) authorClearance = 75;

				if (command.userPermissions.length !== 0) {
					for (let i = 0; i < command.userPermissions.length; i++) {
						if (
							message.member.hasPermission(
								command.userPermissions[i].toString()
							)
						)
							authorClearance = 100;
					}
				}

				guild.moderationRoles.forEach((o) => {
					if (
						message.member.roles.cache.has(o.roleId) &&
						authorClearance < o.clearanceLevel
					)
						authorClearance = o.clearanceLevel;
				});

				if (clearanceLevel > authorClearance)
					return message.channel.send(":lock: Missing permission");

				const permissions = new Permissions(message.guild.me.permissions);
				if (permissions.has(command.clientPermissions)) {
					command.run(client, message, args).catch((err) => {
						Logger.error(err);
						message.channel.send(Translator.Translate("global_error"));
					});

					if (guild.trackAnalytics) Commandtils.CommandAnalyticsHandler(cmd);
				} else {
					return message.channel.send(
						"**Missing required permissions** to run this command. I need the following permssions\n```" +
							command.clientPermissions +
							"```"
					);
				}
			}
		}
	);
};

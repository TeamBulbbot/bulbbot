const clc = require("cli-color");
const Discord = require("discord.js");
const Guild = require("../models/guild");
const Database = require("../handlers/Database");
const { Permissions } = require("discord.js");

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
			if (err) console.error(clc.red(err));
			if (guild == null) Database.AddGuild(message.guild);

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
				const permissions = new Permissions(message.guild.me.permissions);

				if (permissions.has(command.clientPermissions)) {
					command.run(client, message, args).catch((err) => {
						console.error(err);
						message.channel.send(
							"**An error has occurred**, please check the the permssion level of the bot or try again later. If the issue persists contact the bot developers."
						);
					});

					if (guild.trackAnalytics) await Database.CommandAnalyticsHandler(cmd);
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

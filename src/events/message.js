const Event = require("../structures/Event");
const { getPrefix, isPremiumGuild } = require("../utils/guilds/Guild");
const { client_command_usage, activity_guilds } = require("../utils/prometheus/metrics");
const DirectMessage = require("../utils/DirectMessages");
const AutoMod = require("../utils/AutoMod");
const GetGuildOverrideForCommand = require("../utils/clearance/commands/GetGuildOverrideForCommand");
const UserClearance = require("../utils/clearance/user/UserClearance");
const Discord = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
		// handle dms
		if (message.channel.type === "dm") return DirectMessage(this.client, message);

		// grab the prefix for the guild
		this.client.prefix = await getPrefix(message.guild);

		// guild activity
		activity_guilds(message.guild.id);
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>`);
		if (!message.guild || message.author.bot) return;

		// auto mod
		await AutoMod.Master(this.client, message);

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for **${message.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (!message.content.startsWith(this.client.prefix)) return;

		global.currentGuildId = message.guild.id;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.premium && !(await isPremiumGuild(message.guild.id)))
				return message.channel.send(await this.client.bulbutils.translate("premium_message"));

			const commandOverride = await GetGuildOverrideForCommand(message.guild.id, command.name);
			const userClearance = await UserClearance(message, message.guild.id);
			let clearance = 0;

			if (message.guild.ownerID === message.author.id) clearance = 100;
			if (message.member.hasPermission(["ADMINISTRATOR"])) clearance = 75;
			if (userClearance > clearance) clearance = userClearance;

			if (commandOverride !== undefined) {
				if (!commandOverride.enabled) return;

				if (commandOverride.clearanceLevel > clearance) return;
			}

			global.userClearance = clearance;

			const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
			if (userPermCheck) {
				const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);

				if (missing.length) {
					return message.channel.send(await this.client.bulbutils.translate("global_missing_permission")).then(msg => {
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
				}
			}

			const clientPermCheck = command.clientPerms;
			if (clientPermCheck) {
				const missing = message.guild.me.hasPermission(clientPermCheck);

				if (!missing)
					return message.channel.send(
						await this.client.bulbutils.translate("global_missing_permission_bot", {
							missing: clientPermCheck.toArray().join(", "),
						}),
					);
			}

			if (command.devOnly) if (!global.config.developers.includes(message.author.id)) return;

			if (command.maxArgs < args.length && command.maxArgs !== -1) {
				return message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected", {
						arg: args[command.maxArgs],
						arg_expected: command.maxArgs,
						arg_provided: args.length,
						usage: command.usage,
					}),
				);
			}

			if (command.minArgs > args.length) {
				return message.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing", {
						arg: command.argList[args.length],
						arg_expected: command.minArgs,
						arg_provided: args.length,
						usage: command.usage,
					}),
				);
			}

			command.run(message, args);
			client_command_usage(command.name);
		}
	}
};

const Event = require("../structures/Event");
const { client_command_usage, activity_guilds } = require("../utils/prometheus/metrics");
const DirectMessage = require("../utils/DirectMessages");
const AutoMod = require("../utils/AutoMod");
const ClearanceManager = new (require("../utils/clearance/ClearanceManager"))
const DatabaseManager = new (require("../utils/database/DatabaseManager"))

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
		// handle dms
		if (message.channel.type === "dm") return DirectMessage(this.client, message);
		if (!message.guild || message.author.bot) return;

		const { prefix, premiumGuild } = await DatabaseManager.getConfig(message.guild)

		if (prefix === undefined && message.content.startsWith(global.config.prefix))
			return message.channel.send(
				"Please remove and re add the bot to the server https://bulbbot.mrphilip.xyz/invite, there has been an error with the configuration of the guild",
			);

		// set the prefix for the guild
		this.client.prefix = prefix;

		// guild activity
		activity_guilds(message.guild.id);
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>`);

		// fetch user clearance
		const clearance = await ClearanceManager.getUserClearance(message, message.guild.id);

		// auto mod
		if (clearance < 25)
			try {
				await AutoMod.Master(this.client, message, clearance);
			} catch (err) {}

		if (!message.content.startsWith(this.client.prefix) && !message.content.match(mentionRegex)) return;
		if (message.content.match(mentionRegex) && message.content.replace(mentionRegex, "").trim().length === 0)
			return message.channel.send(`My prefix for **${message.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (message.content.match(mentionRegex)) message.content = `!${message.content.replace(mentionRegex, "").trim()}`;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!command) return;
		if (command.premium && !premiumGuild) return message.channel.send(await this.client.bulbutils.translate("premium_message", message.guild.id));

		const commandOverride = await ClearanceManager.getCommandOverride(message.guild.id, command.name);
		const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
		const missing = message.guild.me.permissionsIn(message.channel).has(userPermCheck);

		if (commandOverride !== undefined) {
			if (!commandOverride["enabled"]) return;
			if (commandOverride["clearanceLevel"] > clearance) {
				return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
					message.delete({ timeout: 5000 });
					msg.delete({ timeout: 5000 });
				});
			}
		}

		global.userClearance = clearance;

		if (command.clearance > clearance && !commandOverride) {
			return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
				message.delete({ timeout: 5000 });
				msg.delete({ timeout: 5000 });
			});
		}

		if (userPermCheck && !(clearance < command.clearance)) {
			if (missing.length) {
				return message.channel
					.send(await this.client.bulbutils.translate("global_missing_permission_bot", message.guild.id, { missing }))
					.then(msg => {
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
			}
		}

		const clientPermCheck = command.clientPerms;
		if (clientPermCheck) {
			let missing = !message.guild.me.hasPermission(clientPermCheck);
			//if (!missing) missing = !message.guild.me.permissionsIn(message.channel).has(clientPermCheck);

			if (missing)
				return message.channel.send(
					await this.client.bulbutils.translate("global_missing_permission_bot", message.guild.id, {
						missing: clientPermCheck.toArray().map(perm => `\`${perm}\` `),
					}),
				);
		}

		if (command.subDevOnly)
			if (!global.config.developers.includes(message.author.id) && !global.config.subDevelopers.includes(message.author.id)) return;
		if (command.devOnly) if (!global.config.developers.includes(message.author.id)) return;

		if (command.maxArgs < args.length && command.maxArgs !== -1) {
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_unexpected", message.guild.id, {
					arg: args[command.maxArgs],
					arg_expected: command.maxArgs,
					arg_provided: args.length,
					usage: command.usage,
				}),
			);
		}

		if (command.minArgs > args.length) {
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: command.argList[args.length],
					arg_expected: command.minArgs,
					arg_provided: args.length,
					usage: command.usage,
				}),
			);
		}

		try {
			await command.run(message, args).catch();
		} catch (error) {
			await this.client.bulbutils.log(error, message);
		}

		client_command_usage(command.name);
	}
};

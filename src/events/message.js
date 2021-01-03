const Event = require("../structures/Event");
const { getPrefix } = require("../utils/guilds/Guild");
const { client_command_usage, activity_guilds } = require("../utils/prometheus/metrics");
const DirectMessage = require("../utils/DirectMessages");

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
		if (message.channel.type === "dm") return DirectMessage(this.client, message);

		this.client.prefix = await getPrefix(message.guild);
		activity_guilds(message.guild.id);

		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>`);
		if (!message.guild || message.author.bot) return;
		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for **${message.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (!message.content.startsWith(this.client.prefix)) return;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
			if (userPermCheck) {
				const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
				if (missing.length) {
					return message.channel.send(this.client.bulbutils.translate("global_missing_permission")).then(msg => {
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
				}
			}

			const clientPermCheck = command.userPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
			if (clientPermCheck) {
				const missing = message.channel.permissionsFor(message.member).missing(clientPermCheck);
				if (missing.length) {
					return message.channel.send(this.client.bulbutils.translate("global_missing_permission_bot"));
				}
			}

			if (command.devOnly) if (!global.config.developers.includes(message.author.id)) return;

			if (command.maxArgs < args.length && command.maxArgs !== -1) {
				return message.channel.send(
					this.client.bulbutils.translate("event_message_args_unexpected", {
						arg: args[command.maxArgs],
						arg_expected: command.maxArgs,
						arg_provided: args.length,
						usage: command.usage,
					}),
				);
			}

			if (command.minArgs > args.length) {
				return message.channel.send(
					this.client.bulbutils.translate("event_message_args_missing", {
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

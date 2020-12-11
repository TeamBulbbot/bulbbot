const Event = require("../structures/Event");
const BulbBotUtils = require("./../utils/BulbBotUtils");
const { getPrefix } = require("../utils/guilds/Guild");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
		this.client.prefix = await getPrefix(message.guild);

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
					return message.channel.send(BulbBotUtils.translation.translate("global_missing_permission")).then(msg => {
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
				}
			}

			const clientPermCheck = command.userPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
			if (clientPermCheck) {
				const missing = message.channel.permissionsFor(message.member).missing(clientPermCheck);
				if (missing.length) {
					return message.channel.send(BulbBotUtils.translation.translate("global_missing_permission_bot"));
				}
			}

			let developers = process.env.DEVELOPERS.split(",");
			if (command.devOnly) if (!developers.includes(message.author.id)) return;

			if (command.maxArgs < args.length) {
				return message.channel.send(
					BulbBotUtils.translation.translate("event_message_args_check_violation", {
						arg: args[command.maxArgs],
						arg_expected: command.maxArgs,
						arg_provided: args.length,
						usage: command.usage,
					}),
				);
			}

			command.run(message, args);
		}
	}
};

const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Configure the automod in your server",
			category: "Configuration",
			aliases: ["am"],
			usage: "!automod <action>",
			examples: ["automod enable", "automod edit", "automod punishment"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			// automod enable
			case "enable":
				await require("./automod/enable")(this.client, message, args);
				break;

			// automod disable [part] | if part is empty disable automod
			case "disable":
				await require("./automod/disable")(this.client, message, args);
				break;

			// automod add <part> <value>
			case "add":
				await require("./automod/add")(this.client, message, args);
				break;

			// automod remove <part> <value>
			case "remove":
				await require("./automod/remove")(this.client, message, args);
				break;

			// automod punishment <part> <action>
			case "punishment":
				await require("./automod/punishment")(this.client, message, args);
				break;

			// automod settings
			case "settings":
				await require("./automod/settings")(this.client, message, args);
				break;

			// automod limit <part> <number>
			case "limit":
				await require("./automod/limit")(this.client, message, args);
				break;

			default:
				message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild.id, {
						arg: args[0].toLowerCase(),
						arg_expected: "action:string",
						usage: "`enable`, `disable`, `add`, `remove`, `limit`, `punishment`, `settings`",
					}),
				);
				break;
		}
	}
};

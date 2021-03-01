const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Configure command overrides",
			category: "Configuration",
			aliases: ["ov"],
			usage: "!override <action>",
			examples: ["override create", "override remove", "override disable"],
			argList: ["action:Action"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			// override create role|command <name> <clearance>
			case "add":
			case "create":
				await require("./override/create")(this.client, message, args);
				break;

			// override remove role|command <name>
			case "delete":
			case "remove":
				await require("./override/remove")(this.client, message, args);
				break;

			// override edit role|command <name> <clearance>
			case "cfg":
			case "edit":
				await require("./override/edit")(this.client, message, args);
				break;

			// override enable <name>
			case "enable":
				await require("./override/enable")(this.client, message, args);
				break;

			// override disable <name>
			case "disable":
				await require("./override/disable")(this.client, message, args);
				break;

			default:
				message.channel.send(await this.client.bulbutils.translate("override_invalid_arguments"));
				break;
		}
	}
};

const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Infraction Desc",
			category: "Moderation",
			aliases: ["inf"],
			usage: "!infraction <action>",
			userPerms: ["MANAGE_GUILD"],
			clearance: 50,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			case "delete":
			case "remove":
				await require("./Infraction/delete").Call(this.client, message, args)
				break;

			case "info":
				await require("./Infraction/info").Call(this.client, message, args)
				break;

			default:
				break;
		}
	}
};
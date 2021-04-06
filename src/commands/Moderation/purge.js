const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear", "clean"],
			usage: "!purge <amount>",
			examples: ["purge 30"],
			argList: ["amount:integer"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES", "ATTACH_FILES"],
		});
	}

	async run(message, args) {
		switch (args[0]) {
			case "all":
				await require("./Purge/all").Call(this.client, message, args);
				break;
			case "user":
				await require("./Purge/user").Call(this.client, message, args);
				break;
			default:
				message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild.id, {
						arg: args[0].toLowerCase(),
						arg_expected: "action:string",
						usage: "`all`, `user`",
					}),
				);
				break;
		}
	}
};

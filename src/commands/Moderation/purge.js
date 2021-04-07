const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear", "clean"],
			usage: "!purge <type> [argument] <amount>",
			examples: ["purge bots 30"],
			argList: ["action:string"],
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
			case "between":
				await require("./Purge/between").Call(this.client, message, args);
				break;
			case "images":
				await require("./Purge/images").Call(this.client, message, args);
				break;
			case "embeds":
				await require("./Purge/embeds").Call(this.client, message, args);
				break;
			case "bots":
				await require("./Purge/bots").Call(this.client, message, args);
				break;
			default:
				message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild.id, {
						arg: args[0].toLowerCase(),
						arg_expected: "action:string",
						usage: "`all`, `user`, `between`, `images`, `embeds`, `bots`",
					}),
				);
				break;
		}
	}
};

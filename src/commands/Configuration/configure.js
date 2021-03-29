const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Configure the bot in your server",
			category: "Configuration",
			aliases: ["cfg", "conf", "config", "setting"],
			usage: "!configure <part>",
			examples: ["configure prefix", "configure mod_action", "configure mute_role"],
			argList: ["setting:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			// configure prefix <prefix>
			case "prefix":
				await require("./configure/prefix")(this.client, message, args);
				break;

			// configure language <language>
			case "language":
				await require("./configure/language")(this.client, message, args);
				break;

			// configure mute <role>|remove
			case "mute_role":
			case "mute":
				await require("./configure/mute")(this.client, message, args);
				break;

			case "mod_action":
			case "modaction":
			case "mod":
				await require("./configure/logging")(this.client, message, args, "modaction");
				break;

			case "automod":
				await require("./configure/logging")(this.client, message, args, "automod");
				break;

			case "messagelogs":
			case "message":
				await require("./configure/logging")(this.client, message, args, "message");
				break;

			case "rolelogs":
			case "role":
				await require("./configure/logging")(this.client, message, args, "role");
				break;

			case "memberlogs":
			case "member":
				await require("./configure/logging")(this.client, message, args, "member");
				break;

			case "channellogs":
			case "channel":
				await require("./configure/logging")(this.client, message, args, "channel");
				break;

			case "joinleavelogs":
			case "joinleave":
				await require("./configure/logging")(this.client, message, args, "joinleave");
				break;

			default:
				message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild.id, {
						arg: args[0].toLowerCase(),
						arg_expected: "part:string",
						usage:
							"`prefix`, `language`, `mute_role|mute`, `mod_action|modaction|mod`, `automod`, `messagelogs|message`, `rolelogs|role`, `memberlogs|member`, `channelogs|channel`, `joinleavelogs|joinleave`",
					}),
				);
				break;
		}
	}
};

const Command = require("../../structures/Command");
const { Enable, Disable } = require("../../utils/configuration/PremiumUtils");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Control the premium config of the bot",
			category: "Admin",
			usage: "!premium <action> <guild>",
			examples: ["premium enable 742094927403679816", "premium disable 742094927403679816"],
			minArgs: 2,
			maxArgs: -1,
			argList: ["action:string", "guild:string"],
			devOnly: true,
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			case "enable":
				await Enable(args[1]);
				message.channel.send(`Enabled premium for guild \`${args[1]}\``);
				break;
			case "disable":
				await Disable(args[1]);
				message.channel.send(`Disabled premium for guild \`${args[1]}\``);
				break;
			default:
				break;
		}
	}
};

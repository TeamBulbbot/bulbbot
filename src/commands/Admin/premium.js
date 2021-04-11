const Command = require("../../structures/Command");
const DatabaseManager = new (require("../../utils/database/DatabaseManager"));

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
		let guild;
		try {
			guild = await this.client.guilds.fetch(args[1]);
		} catch (err) {
			return message.channel.send("Could not fetch the specified guild!");
		}

		switch (args[0].toLowerCase()) {
			case "enable":
				await DatabaseManager.setPremium(guild.id, true);
				message.channel.send(`Enabled premium for guild \`${guild.id}\``);
				break;
			case "disable":
				await DatabaseManager.setPremium(guild.id, false);
				message.channel.send(`Disabled premium for guild \`${guild.id}\``);
				break;
			default:
				break;
		}
	}
};

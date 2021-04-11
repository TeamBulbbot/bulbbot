const Command = require("../../structures/Command");
const DatabaseManager = new (require("../../utils/database/DatabaseManager"));

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Runs actions on a given guild",
			category: "Admin",
			usage: "!guild <action> <guild id>",
			examples: ["guild"],
			minArgs: 2,
			maxArgs: -1,
			argList: ["code:string"],
			devOnly: true,
		});
	}

	async run(message, args) {
	
		switch (args[0].toLowerCase()) {
			case "db-yeet":
				await DatabaseManager.deleteGuild(args[1]);
				message.channel.send("success deleted that guild from the database")
				break;
		
			default:
				break;
		}
	}
};

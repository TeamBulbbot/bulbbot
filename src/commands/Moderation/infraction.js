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
			clientPerms: ["EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(message, args) {
		switch (args[0].toLowerCase()) {
			case "delete":
			case "remove":
				await require("./Infraction/delete").Call(this.client, message, args);
				break;

			case "info":
				await require("./Infraction/info").Call(this.client, message, args);
				break;

			case "list":
			case "all":
				await require("./Infraction/list").Call(this.client, message);
				break;

			case "msearch":
			case "modsearch":
				await require("./Infraction/modsearch").Call(this.client, message, args);
				break;

			case "osearch":
			case "offendersearch":
				await require("./Infraction/offendersearch").Call(this.client, message, args);
				break;

			case "search":
				await require("./Infraction/search").Call(this.client, message, args);
				break;

			case "claim":
				await require("./Infraction/claim").Call(this.client, message, args);
				break;

			case "update":
				await require("./Infraction/update").Call(this.client, message, args);
				break;

			default:
				message.channel.send(await this.client.bulbutils.translate("infraction_invalid_arguments", message.guild.id));
				break;
		}
	}
};

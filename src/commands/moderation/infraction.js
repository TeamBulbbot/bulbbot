const Translator = require("../../utils/lang/translator");

const Handler = require("./infraction/master");

module.exports = {
	name: "infraction",
	aliases: ["inf"],
	category: "moderation",
	description: "Infraction related commands",
	usage: "infraction <option>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("infraction_missing_arg_option")
			);

		const option = args[0];

		switch (option) {
			// Search and find all infractions that have the provided ID set on them
			// infraction|inf search| <ID>
			case "search":
				await Handler.Handle("search", client, message, args)
				break;

			// Search and find all the infractions made by the Mod ID
			// infraction|inf msearch|modsearch <Mod ID>
			case "msearch":
			case "modsearch":
				await Handler.Handle("modsearch", client, message, args)
				break;

			// Search and find all the infractions target to that id
			// infraction|inf osearch|offedersearch <Target ID>
			case "osearch":
			case "offedersearch":
				await Handler.Handle("offendersearch", client, message, args)
				break;

			// Edit the response reason for a infraction
			// infraction|inf edit|update <Infraction Id> [New reason]
			case "edit":
			case "update":
				await Handler.Handle("update", client, message, args)
				break;

			// Claim responsibility for another infraction
			// infraction|inf claim <Infraction Id>
			case "claim":
				await Handler.Handle("claim", client, message, args)
				break;

			// Delete and infraction from the system
			// infraction|inf delete|del|remove <Infraction Id> [Reason]
			case "delete":
			case "del":
			case "remove":
				await Handler.Handle("remove", client, message, args)
				break;

			// Get info about a infracton
			// infraction|inf info <Infraction Id>
			case "info":
				Handler.Handle("info", client, message, args)
				break;

			// Return all infractions in guild
			// infraction|inf all|list
			case "all":
			case "list":
				await Handler.Handle("list", client, message);

				break;
			default:
				message.channel.send(
					Translator.Translate("infraction_invalid_arg_option")
				);
				break;
		}
	},
};
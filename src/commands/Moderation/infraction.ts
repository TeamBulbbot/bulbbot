import Command from "../../structures/Command";
import search from "./infraction/search";
import info from "./infraction/info";
import claim from "./infraction/claim";
import update from "./infraction/update";
import modsearch from "./infraction/modsearch";
import offendersearch from "./infraction/offendersearch";
import remove from "./infraction/remove";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Manage infractions.",
			category: "Moderation",
			subCommands: [search, info, claim, update, modsearch, offendersearch, remove],
			aliases: ["inf"],
			usage: "<action>",
			userPerms: ["MANAGE_GUILD"],
			clearance: 50,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:String"],
			clientPerms: ["EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
		});
	}
}

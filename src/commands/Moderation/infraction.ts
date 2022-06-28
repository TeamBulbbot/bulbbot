import Command from "../../structures/Command";
import info from "./infraction/info";
import claim from "./infraction/claim";
import update from "./infraction/update";
import modsearch from "./infraction/modsearch";
import offendersearch from "./infraction/offendersearch";
import remove from "./infraction/remove";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import search from "./infraction/search";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name: name,
			description: "Manage infractions.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [search],
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}
}

export class lol extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Manage infractions.",
			category: "Moderation",
			subCommands: [info, claim, update, modsearch, offendersearch, remove],
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

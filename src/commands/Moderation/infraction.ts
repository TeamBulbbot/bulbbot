import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import search from "./infraction/search";
import info from "./infraction/info";
import claim from "./infraction/claim";
import remove from "./infraction/remove";
import update from "./infraction/update";
import modsearch from "./infraction/modsearch";
import offendersearch from "./infraction/offendersearch";

export default class Infraction extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name: name,
			description: "Manage infractions.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [search, info, claim, remove, update, modsearch, offendersearch],
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}
}

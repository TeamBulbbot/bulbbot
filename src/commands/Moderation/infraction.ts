import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import search from "./infraction/search";
import info from "./infraction/info";
import claim from "./infraction/claim";
import remove from "./infraction/remove";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name: name,
			description: "Manage infractions.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [search, info, claim, remove],
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}
}

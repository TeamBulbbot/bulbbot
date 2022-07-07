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

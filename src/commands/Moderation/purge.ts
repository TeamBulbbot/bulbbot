import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import all from "./purge/all";
import user from "./purge/user";
import bots from "./purge/bots";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Purge messages from a channel.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [all, user, bots],
			command_permissions: ["MANAGE_MESSAGES"],
			client_permissions: ["MANAGE_MESSAGES"],
		});
	}
}

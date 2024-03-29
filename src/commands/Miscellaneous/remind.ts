import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import set from "./remind/set";
import list from "./remind/list";
import remove from "./remind/remove";

export default class Reminder extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Reminds you of something in the future.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [set, list, remove],
		});
	}
}

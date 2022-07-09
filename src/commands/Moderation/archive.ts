import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import BulbBotClient from "../../structures/BulbBotClient";
import user from "./archive/user";
import channel from "./archive/channel";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Archive commands",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [user, channel],
			command_permissions: ["MANAGE_MESSAGES"],
		});
	}
}

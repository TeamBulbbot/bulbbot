import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import _delete from "./banpool/delete";
import create from "./banpool/create";
import invite from "./banpool/invite";
import list from "./banpool/list";
import remove from "./banpool/remove";
import info from "./banpool/info";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Manage banpools",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [create, invite, list, _delete, remove, info],
			command_permissions: ["ADMINISTRATOR"],
			client_permissions: ["BAN_MEMBERS"],
		});
	}
}

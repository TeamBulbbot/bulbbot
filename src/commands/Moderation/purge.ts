import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import all from "./purge/all";
import user from "./purge/user";
import bots from "./purge/bots";
import contains from "./purge/contains";
import embeds from "./purge/embeds";
import emojis from "./purge/emojis";
import images from "./purge/images";
import until from "./purge/until";
import between from "./purge/between";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Purge messages from a channel.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			subCommands: [all, user, bots, contains, embeds, emojis, images, until, between],
			command_permissions: ["MANAGE_MESSAGES"],
			client_permissions: ["MANAGE_MESSAGES"],
		});
	}
}

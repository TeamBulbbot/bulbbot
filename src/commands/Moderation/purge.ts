import Command from "../../structures/Command";
import all from "./purge/all";
import embeds from "./purge/embeds";
import images from "./purge/images";
import bots from "./purge/bots";
import emojis from "./purge/emojis";
import user from "./purge/user";
import contains from "./purge/contains";
import between from "./purge/between";
import until from "./purge/until";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear", "clean"],
			subCommands: [all, embeds, images, bots, emojis, user, contains, between, until],
			usage: "<type> [argument] <amount>",
			examples: ["purge bots 30"],
			argList: ["type:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES", "ATTACH_FILES"],
		});
	}
}

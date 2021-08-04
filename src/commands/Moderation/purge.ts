import Command from "../../structures/Command";
import { Message } from "discord.js";
import all from "./purge/all";
import embeds from "./purge/embeds";
import images from "./purge/images";
import bots from "./purge/bots";
import emojis from "./purge/emojis";
import user from "./purge/user";
import contains from "./purge/contains";
import between from "./purge/between";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear", "clean"],
			subCommands: [all, embeds, images, bots, emojis, user, contains, between],
			usage: "<type> [argument] <amount>",
			examples: ["purge bots 30"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES", "ATTACH_FILES"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		await message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: "action:string",
				argument_list: "`all`, `embeds`, `images`, `bots`, `emojis`, `user`, `contains`, `between`",
			}),
		);
	}
}

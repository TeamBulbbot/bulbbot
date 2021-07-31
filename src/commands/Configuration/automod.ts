import { Message } from "discord.js";
import Command from "../../structures/Command";

import enable from "./automod/enable";
import settings from "./automod/settings";
import add from "./automod/add";
import disable from "./automod/disable";
import remove from "./automod/remove";
import punishment from "./automod/punishment";
import limit from "./automod/limit";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Configure the automod in your server",
			category: "Configuration",
			subCommands: [enable, settings, add, disable, remove, punishment, limit],
			aliases: ["am"],
			usage: "!automod <action>",
			examples: ["automod enable", "automod edit", "automod punishment"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		await message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
				arg: args[0].toLowerCase(),
				arg_expected: "action:string",
				usage: "`enable`, `disable`, `add`, `remove`, `limit`, `punishment`, `settings`",
			}),
		);
	}
}

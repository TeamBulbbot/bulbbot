import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";

import enable from "../automod/enable";
import settings from "../automod/settings";
import add from "../automod/add";
import disable from "../automod/disable";
import remove from "../automod/remove";
import punishment from "../automod/punishment";
import limit from "../automod/limit";

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "automod",
			description: "Configure the automod in your server",
			category: "Configuration",
			subCommands: [enable, settings, add, disable, remove, punishment, limit],
			aliases: ["am"],
			usage: "!configure automod <action>",
			examples: ["configure automod enable", "configure automod edit", "configure automod punishment"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	public async run(message: Message, args: string[]): Promise<Message | void> {
		await message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
				arg: args[0].toLowerCase(),
				arg_expected: "action:string",
				usage: "`enable`, `disable`, `add`, `remove`, `limit`, `punishment`, `settings`",
			}),
		);
	}
}

import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";

import create from "../override/create";
import disable from "../override/disable";
import edit from "../override/edit";
import enable from "../override/enable";
import list from "../override/list";
import remove from "../override/remove";

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "override",
			subCommands: [create, disable, edit, enable, list, remove],
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			usage: "configure override <action...>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		return await message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: "action:string",
				usage: "`create`, `edit`, `delete`, `list`, `enable`, `disable`",
			}),
		);
	}
}

import Command from "../../structures/Command";
import { Message } from "discord.js";
import clearfiles from "./admin/clearfiles";
import leave from "./admin/leave";
import join from "./admin/join";
import dbAdd from "./admin/db-add";
import dbInfo from "./admin/db-info";
import dbReset from "./admin/db-reset";
import dbYeet from "./admin/db-yeet";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Admin commands",
			category: "Admin",
			subCommands: [clearfiles, leave, join, dbAdd, dbInfo, dbReset, dbYeet],
			usage: "admin <action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			devOnly: true,
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		if(!args.length)
			return await message.channel.send(
				await this.client.bulbutils.translateNew("event_message_args_missing", message.guild?.id, {
					argument: "action",
					arg_expected: "action:string",
					usage: "`clearfiles`, `db-add`, `db-info`, `db-reset`, `db-yeet`, `join`, `leave`",
				}),
			);

		return await message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: "action:string",
				usage: "`clearfiles`, `db-add`, `db-info`, `db-reset`, `db-yeet`, `join`, `leave`",
			}),
		);
	}
}

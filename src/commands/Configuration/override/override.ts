import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "override",
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["role:Role"],
			usage: "!configure override <action...>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const action: string = args[1];

		switch (action) {
			case "create":
			case "add":
				await require("./create").default(this.client, message, args);
				break;
			case "edit":
				await require("./edit").default(this.client, message, args);
				break;
			case "list":
				await require("./list").default(this.client, message, args);
				break;
			case "disable":
				await require("./disable").default(this.client, message, args);
				break;
			case "enable":
				await require("./enable").default(this.client, message, args);
				break;
			case "delete":
			case "remove":
				await require("./remove").default(this.client, message, args);
				break;
			default:
				return await message.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
						arg: args[0].toLowerCase(),
						arg_expected: "action:string",
						usage: "create, edit, list",
					}),
				);
		}
	}
}

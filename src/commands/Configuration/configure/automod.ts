import { SubCommand } from "../../../structures/SubCommand";
import { Message } from "discord.js";
import Command from "../../../structures/Command";

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "automod",
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["part:string"],
			usage: "!configure logging <part> <setting>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<Message | void> {
		const action: string = args[1];

		switch (action) {
			case "settings":
				await require("../automod/settings").default(this.client, message);
				break;
			case "enable":
				await require("../automod/enable").default(this.client, message)
		}
	}
}
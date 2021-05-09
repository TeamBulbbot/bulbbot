import { SubCommand } from "../../../structures/SubCommand";
import { Message } from "discord.js";

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "all",
			aliases: ["idk", "lel"],
			clearance: 50,
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		await message.channel.send("Even bigger yeet");
	}
}

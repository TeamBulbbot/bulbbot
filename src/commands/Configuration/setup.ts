import Command from "../../structures/Command";
import { Message } from "discord.js";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Configures the bot in your guild",
			category: "Configuration",
			usage: "!setup",
			clearance: 75,
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		await message.channel.send("Welcome to Bulbbot setup. Choose your server prefix.");
	}
}
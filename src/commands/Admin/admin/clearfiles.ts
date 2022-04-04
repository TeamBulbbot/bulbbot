import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import { readdirSync, unlinkSync } from "fs";
import { join } from "path";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "clearfiles",
			description: "Clears all files from the storage",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		let count = 0;
		const path = `${__dirname}/../../../../files`;
		const files: string[] = readdirSync(path);
		for (const file of files) {
			if (file.endsWith(".gitignore")) continue;

			count++;
			unlinkSync(join(path, file));
		}

		context.channel.send(`Successfully deleted \`${count}\` files from the storage`);
	}
}

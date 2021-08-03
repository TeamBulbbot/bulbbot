import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";
import { readdirSync, unlinkSync } from "fs";
import { join } from "path";

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "clearfiles",
			usage: "admin clearfiles",
		});
	}

	public async run(message: Message): Promise<void | Message> {
		let count: number = 0;
		const path: string = `${__dirname}/../../../../files`;
		const files: string[] = readdirSync(path);
		for (const file of files) {
			if (!file.endsWith(".txt") && !file.endsWith(".js") && !file.endsWith(".json")) continue;
			count++;
			unlinkSync(join(path, file));
		}

		message.channel.send(`Successfully deleted \`${count}\` files from the storage`);
	}
}

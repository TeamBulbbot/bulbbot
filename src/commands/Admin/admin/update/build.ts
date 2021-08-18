import { Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { cd, exec } from "shelljs";
import { join } from "path";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "build",
			usage: "build",
		});
	}

	public async run(message: Message): Promise<void | Message> {
		// builds the JavasScript code from the TypeScript Code
		const path: string = join(__dirname, "/../../../../../");
		cd(path);

		await exec(`tsc --project tsconfig.json`);
		message.reply("Successfully built TypeScript files");
	}
}

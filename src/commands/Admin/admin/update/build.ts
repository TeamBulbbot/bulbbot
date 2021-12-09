import { Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { cd, exec } from "shelljs";
import { join } from "path";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "build",
			usage: "build",
			aliases: ["compile"],
			description: "Compiles the TypeScript files",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		const path: string = join(__dirname, "/../../../../../");
		cd(path);

		await exec(`tsc --project tsconfig.json`);
		context.reply("Successfully built TypeScript files");
	}
}

import { Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { cd, exec, ShellString } from "shelljs";
import { join } from "path";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "full",
			usage: "full",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		// pulls the latest code from github, builds the code and restarts the bot
		await context.reply("Okay, starting to pull the latest code!");
		const path: string = join(__dirname, "/../../../../../");
		const PM2_PROCESS: String = "bulbbot";

		await cd(path);

		const resp: ShellString = await exec(`git pull`);

		if (resp) await context.reply(`**Code:** ${resp.code.toString()}\n**Message:**\n\`\`\`${resp.stdout}\`\`\`**Error Message:**\n\`\`\`${resp.stderr}\`\`\``);
		await context.reply(`Successfully pulled the latest code\nCode: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
		await exec(`tsc --project tsconfig.json`);
		await context.reply("Successfully built TypeScript files");
		await context.reply("Restarting the bot now!");
		await exec(`pm2 restart ${PM2_PROCESS}`);
	}
}

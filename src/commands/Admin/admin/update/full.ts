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
		const path: string = join(__dirname, "/../../../../../");
		const PM2_PROCESS: String = "bulbbot";

		context.reply("Okey starting to pull the latest code!");

		cd(path);

		const resp: ShellString = exec(`git pull`);

		if (resp) context.reply(`**Code:** ${resp.code.toString()}\n**Message:**\n\`\`\`${resp.stdout}\`\`\`**Error Message:**\n\`\`\`${resp.stderr}\`\`\``);
		context.reply(`Successfully pulled the latest code\nCode: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
		await exec(`tsc --project tsconfig.json`);
		context.reply("Successfully built TypeScript files");
		context.reply("Restarting the bot now!");
		exec(`pm2 restart ${PM2_PROCESS}`);
	}
}

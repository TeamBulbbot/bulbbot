import { Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { cd, exec, ShellString } from "shelljs";
import { join } from "path";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "force",
			usage: "force",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		// force pulls the HEAD
		const path: string = join(__dirname, "/../../../../../");
		cd(path);

		await exec(`git reset --hard HEAD`);
		await exec(`git clean -f -d`);
		const resp: ShellString = exec(`git pull`);

		if (resp.stderr) return message.reply(`Wow pal an error really?\n**Code:** ${resp.code.toString()}\n**Message:**\n\`\`\`${resp.stdout}\`\`\`**Error Message:**\n\`\`\`${resp.stderr}\`\`\``);
		message.reply(`Successfully force pullled\nCode: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
	}
}

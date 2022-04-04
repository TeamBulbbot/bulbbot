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
			name: "force",
			usage: "force",
			description: "Force pulls the HEAD",
		});
	}

	public async run(context: CommandContext, _args: string[]): Promise<void | Message> {
		const path: string = join(__dirname, "/../../../../../");
		cd(path);

		await exec(`git reset --hard HEAD`);
		await exec(`git clean -f -d`);
		const resp: ShellString = exec(`git pull`);

		if (resp.stderr) return context.channel.send(`Wow pal an error really?\n**Code:** ${resp.code.toString()}\n**Message:**\n\`\`\`${resp.stdout}\`\`\`**Error Message:**\n\`\`\`${resp.stderr}\`\`\``);
		context.channel.send(`Successfully force pulled\nCode: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
	}
}

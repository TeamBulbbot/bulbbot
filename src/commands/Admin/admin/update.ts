import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import { cd, exec, ShellString } from "shelljs";
import { join } from "path";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "update",
			minArgs: 1,
			maxArgs: 1,
			argList: ["type:string"],
			usage: "<type>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const PM2_PROCESS: String = "bulbbot";

		let type: String = args[0].toLowerCase();
		const validTypes: String[] = ["normal", "modules", "force"];
		if (!validTypes.includes(type)) return message.channel.send(`Sorry pal need a valid type, can be one of \`${validTypes.join(", ")}\``);

		const path: string = join(__dirname, "/../../../../");
		cd(path);

		const resp: ShellString = exec(`git pull`);

		//if (resp.stderr) return message.channel.send(`Wow pal an error really?\n**Code:** ${resp.code.toString()}\n**Message:**\n\`\`\`${resp.stdout}\`\`\`**Error Message:**\n\`\`\`${resp.stderr}\`\`\``);
		message.channel.send(`Successfully updated the **code**\nCode: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``).then(async (msg: Message) => {
			// npm install -g npm-check-updates (before, used to update the packages globally use with caution :pleading:)
			if (type == "modules") {
				await exec(`ncu -u --packageFile package.json`);
				await exec(`npm update`);

				const resp: ShellString = exec(`npm install`);
				msg.edit(`Code: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
			} else if (type === "force") {
				await exec(`git reset --hard HEAD`);
				await exec(`git clean -f -d`);

				const resp: ShellString = exec(`git pull`);
				msg.edit(`Code: **${resp.code.toString()}**\n**Message:**\n\`\`\`${resp.stdout}\`\`\``);
			}

			await this.client.bulbutils.sleep(1000);

			// build the files
			await exec(`tsc --project tsconfig.json`);
			msg.edit(`Compiled the TypeScript code to JavaScript, restarting the bot now to load the new code. See you in a bit`);

			// restart the bot
			exec(`pm2 restart ${PM2_PROCESS}`);
		});
	}
}

import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { writeFile } from "fs";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Evaluates the provided JavaScript code",
			category: "Admin",
			aliases: ["ev"],
			usage: "<code>",
			examples: ["eval context.channel.send('hi')"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["code:string"],
			devOnly: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		const clean = async (text: string) => {
			if (typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			else return text;
		};

		try {
			const code: string = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
			if (evaled.includes(process.env.TOKEN)) evaled = evaled.replace(process.env.TOKEN, "Y0U.TH0UGHT.1_W0ULD.L34V3_MY_D1SC0RD_T0K3N_H3R3");
			this.client.log.info(`[DEVELOPER] ${context.author.tag} (${context.author.id}) ran eval with the code: ${code}`);

			if (evaled.length > 2000) {
				writeFile(`${__dirname}/../../../files/EVAL-${context.guild?.id}.js`, await clean(evaled), function (err) {
					if (err) console.error(err);
				});

				await context.channel.send({
					content: "The evaled code is more than 2000 characters so I am giving you a file instead, have fun 🙂",
					files: [`${__dirname}/../../../files/EVAL-${context.guild?.id}.js`],
				});

				return;
			}

			await context.channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
		} catch (err: any) {
			await context.channel.send(`\`ERROR\` \`\`\`xl\n${await clean(err)}\n\`\`\``);
		}
	}
}

import Command from "../../structures/Command";
import { Message } from "discord.js";
import * as fs from "fs";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Evaluates the provided JavaScript code",
			category: "Admin",
			aliases: ["ev"],
			usage: "!eval <code>",
			examples: ["eval message.channel.send('hi')"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["code:string"],
			devOnly: true,
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		const clean = async (text: string) => {
			if (typeof text === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			else return text;
		};

		try {
			const code: string = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
			if (evaled.includes(process.env.TOKEN)) evaled = evaled.replace(process.env.TOKEN, "Y0U.TH0UGHT.1_W0ULD.L34V3_MY_D1SC0RD_T0K3N_H3R3");
			this.client.log.info(`[DEVELOPER] ${message.author.tag} (${message.author.id}) ran eval with the code: ${code}`);

			if (evaled.length > 2000) {
				fs.writeFile(`./files/eval/${message.guild?.id}.txt`, await clean(evaled), function (err) {
					if (err) console.error(err);
				});

				await message.channel.send("The evaled code is more than 2000 characters so I am giving you a file instead, have fun 🙂", {
					files: [`./files/eval/${message.guild?.id}.txt`],
				});

				return fs.unlinkSync(`./files/eval/${message.guild?.id}.txt`);
			}

			await message.channel.send({ code: "js" });
		} catch (err) {
			await message.channel.send(`\`ERROR\` \`\`\`xl\n${await clean(err)}\n\`\`\``);
		}
	}
}

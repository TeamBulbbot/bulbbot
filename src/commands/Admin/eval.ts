import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { writeFile } from "fs";
import BulbBotClient from "../../structures/BulbBotClient";
import { MessageEmbed } from "discord.js";
import { inspect } from "util";

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
		let embed = new MessageEmbed()
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		const start: number = Date.now();
		const code: string = args.join(" ");
		let evaled: any;
		let output: any;
		let isFile: boolean = false;

		this.client.log.info(`[DEVELOPER] ${context.author.tag} (${context.author.id}) ran eval with the code: ${code}`);

		let description: string = `**Input**\n\`\`\`js\n${code}\n\`\`\``;

		try {
			evaled = await eval(code);

			description += `\n**Type:** ${typeof evaled}`;
			if (typeof evaled !== "string") evaled = inspect(evaled);

			evaled = evaled.replace(new RegExp(this.client.token!, "g"), `${Buffer.from(this.client.user!?.id).toString("base64")}.${genString(7)}.${genString(27)}`);

			if (evaled.length < 1950) output = `**Output**\n\`\`\`js\n${evaled}\n\`\`\``;
			else {
				writeFile(`${__dirname}/../../../files/EVAL-${context.guild?.id}.js`, evaled, (err: any) => {
					if (err) this.client.log.error(err);
				});

				isFile = true;
			}

			embed.setColor("GREEN");
		} catch (err: any) {
			description += `\n**Error:** ${err.name}\n> ${err.message}\n \`\`\`\n${err.stack}\n\`\`\``;
			Math.floor(Math.random() * 10) === 0 ? embed.setImage("https://i.imgur.com/YHb5kNm.gif") : null;
			embed.setColor("RED");
		}

		const end: number = Date.now();

		embed.setDescription(description);
		embed.setAuthor(`Run time: ${end - start} ms`);

		context.channel.send({
			embeds: [embed],
			content: output,
			files: isFile
				? [
						{
							attachment: `${__dirname}/../../../files/EVAL-${context.guild?.id}.js`,
							name: "eval.js",
						},
				  ]
				: [],
		});
	}
}

function genString(l: number) {
	var res = "";
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < l; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));

	return Buffer.from(res).toString("base64").substring(0, l);
}

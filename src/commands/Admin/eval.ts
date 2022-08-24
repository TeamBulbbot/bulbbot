import { writeFile } from "fs";
import { inspect } from "util";
import { CommandInteraction, MessageEmbed } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { rootDir } from "../..";

export default class Eval extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Evaluates the provided JavaScript code",
			type: ApplicationCommandType.ChatInput,
			devOnly: true,
			options: [
				{
					required: true,
					name: "code",
					description: "The JavaScript code",
					type: ApplicationCommandOptionType.String,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const code = interaction.options.getString("code", true);
		const embed = new MessageEmbed()
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		const start: number = Date.now();
		let evaled: any;
		let output: any;
		let isFile = false;

		let description = `**Input**\n\`\`\`js\n${code}\n\`\`\``;

		try {
			evaled = await eval(code);

			description += `\n**Type:** ${typeof evaled}`;
			if (typeof evaled !== "string") evaled = inspect(evaled);

			evaled = this.client.token
				? evaled.replace(new RegExp(this.client.token, "g"), `${Buffer.from(this.client.user?.id || "").toString("base64")}.${this.genString(7)}.${this.genString(27)}`)
				: evaled;

			if (evaled.length < 1950) output = `**Output**\n\`\`\`js\n${evaled}\n\`\`\``;
			else {
				writeFile(`${rootDir}/files/EVAL-${interaction.guild?.id}.js`, evaled, (err: any) => {
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
		embed.setAuthor({
			name: `Run time: ${end - start} ms`,
		});

		interaction.reply({
			embeds: [embed],
			content: output,
			files: isFile
				? [
						{
							attachment: `${rootDir}/files/EVAL-${interaction.guild?.id}.js`,
							name: "eval.js",
						},
				  ]
				: [],
		});
	}

	private genString(l: number): string {
		let res = "";
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (let i = 0; i < l; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));

		return Buffer.from(res).toString("base64").substring(0, l);
	}
}

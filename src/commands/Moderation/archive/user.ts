import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFileSync } from "fs";
import moment from "moment";
import { NonDigits } from "../../../utils/Regex";

const { getUserArchive }: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "user",
			clearance: 50,
			minArgs: 1,
			maxArgs: 2,
			argList: ["user:User", "amount:number"],
			usage: "<user> [amount]",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const AMOUNT: number = args[1] ? parseInt(args[1]) : 100;
		if (isNaN(AMOUNT) || AMOUNT > 5000) return context.channel.send(await this.client.bulbutils.translate("archive_too_much", context.guild?.id, {}));
		const user = args[0].replace(NonDigits, "");
		const startMessage = await context.channel.send(await this.client.bulbutils.translate("archive_started_search", context.guild?.id, {}));

		let archive: string = await this.client.bulbutils.translate("archive_header_format", context.guild?.id, {});
		let temp: string;
		const archiveUserData = await getUserArchive(user, context.guild!?.id, AMOUNT);
		if (archiveUserData.length === 0) return startMessage.edit(await this.client.bulbutils.translate("archive_no_data_found", context.guild?.id, {}));
		archiveUserData.forEach(
			(message: { updatedAt: string; channelId: any; messageId: any; authorTag: any; authorId: any; content: any; sticker: any; embed: any; embeds: any; attachments: any[] }) => {
				temp = `[${moment(Date.parse(message.updatedAt)).format("MMMM Do YYYY, h:mm:ss a")}] ${message.channelId}-${message.messageId} | ${message.authorTag} (${message.authorId}): `;
				if (message.content) temp += `C: ${message.content}\n`;
				else if (message.sticker) temp += `S: ${message.sticker}\n`;
				if (message.embed) temp += `E: ${JSON.stringify(message.embeds)}\n`;
				if (message.attachments.length > 0) temp += `A: ${message.attachments.join("\n")}\n`;

				archive += `${temp}`;
			},
		);

		writeFileSync(`${__dirname}/../../../../files/archive-data-${context.guild?.id}-${user}.txt`, archive);
		startMessage.edit({
			content: await this.client.bulbutils.translate("archive_success", context.guild?.id, {
				place: user,
				amountOfMessages: archiveUserData.length,
				searchAmount: AMOUNT,
			}),
			files: [
				{
					attachment: `${__dirname}/../../../../files/archive-data-${context.guild?.id}-${user}.txt`,
					name: "archive.txt",
				},
			],
		});
	}
}

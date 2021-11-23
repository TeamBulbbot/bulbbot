import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFileSync } from "fs";
import moment from "moment";

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
		// todo
		// move to translator

		const AMOUNT: number = args[1] ? parseInt(args[1]) : 100;
		if (AMOUNT > 5000) return context.channel.send("Too much :(");

		let archive: string = "Time, channelId-messageId | AuthorTag (AuthorId): Content/Embeds/Stickers/Attachemnets\n";
		let temp: string;
		const archiveUserData = await getUserArchive(args[0], context.guild!?.id, AMOUNT);
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

		writeFileSync(`${__dirname}/../../../../files/archive-data-${context.guild?.id}-${args[0]}.txt`, archive);
		await context.channel.send({
			content: `Archived data from ${args[0]} found ${archiveUserData.length} messages (search amount: ${AMOUNT})`,
			files: [
				{
					attachment: `${__dirname}/../../../../files/archive-data-${context.guild?.id}-${args[0]}.txt`,
					name: "archive.txt",
				},
			],
		});
	}
}

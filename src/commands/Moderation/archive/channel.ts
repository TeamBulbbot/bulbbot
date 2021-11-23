import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFileSync } from "fs";
import moment from "moment";

const { getChannelArchive }: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "channel",
			clearance: 50,
			minArgs: 1,
			maxArgs: 2,
			argList: ["channel:Channel", "amount:number"],
			usage: "<channel> [amount]",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// todo
		// move to translator
		// check if archiveChannelData is empty
		// send a message to the user that a search has started because this can take a while lol

		const AMOUNT: number = args[1] ? parseInt(args[1]) : 100;
		if (AMOUNT > 5000) return context.channel.send("Too much :(");

		let archive: string = "Time, channelId-messageId | AuthorTag (AuthorId): Content/Embeds/Stickers/Attachemnets\n";
		let temp: string;
		const archiveChannelData = await getChannelArchive(args[0], context.guild!?.id, AMOUNT);
		archiveChannelData.forEach(
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
			content: `Archived data from ${args[0]} found ${archiveChannelData.length} messages (search amount: ${AMOUNT})`,
			files: [
				{
					attachment: `${__dirname}/../../../../files/archive-data-${context.guild?.id}-${args[0]}.txt`,
					name: "archive.txt",
				},
			],
		});
	}
}

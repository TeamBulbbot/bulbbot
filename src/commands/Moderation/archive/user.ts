import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, Guild, User } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFile } from "fs/promises";
import moment from "moment";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { getUserArchive }: DatabaseManager = new DatabaseManager();

export default class ArchiveUser extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "user",
			description: "Retrieve all archived messages from a user",
			options: [
				{
					name: "user",
					description: "The user to retrieve messages from",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "amount",
					description: "The amount of messages to retrieve",
					type: ApplicationCommandOptionType.Integer,
					required: false,
					min_value: 1,
					max_value: 5000,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const user = interaction.options.getUser("user") as User;
		const amount = interaction.options.getInteger("amount") || 100;

		await interaction.reply({
			content: await this.client.bulbutils.translate("archive_started_search", interaction.guild?.id, {}),
			ephemeral: true,
		});

		let archive: string = await this.client.bulbutils.translate("archive_header_format", interaction.guild?.id, {});

		let temp: string;
		const archiveUserData = await getUserArchive(user.id, interaction.guild as Guild, amount);
		if (archiveUserData.length === 0) return void (await interaction.editReply(await this.client.bulbutils.translate("archive_no_data_found", interaction.guild?.id, {})));
		archiveUserData.forEach((message) => {
			temp = `[${moment(message.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}] ${message.channelId}-${message.messageId} | ${message.authorTag} (${message.authorId}): `;
			if (message.content) temp += `C: ${message.content}\n`;
			else if (message.sticker) temp += `S: ${message.sticker}\n`;
			if (message.embed) temp += `E: ${JSON.stringify(message.embed)}\n`;
			if (message.attachments.length > 0) temp += `A: ${message.attachments.join("\n")}\n`;

			archive += `${temp}`;
		});

		await writeFile(`${__dirname}/../../../../files/archive-data-${interaction.guild?.id}-${user.id}.txt`, archive);
		await interaction.editReply(await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}));
		return void (await interaction.followUp({
			content: await this.client.bulbutils.translate("archive_success", interaction.guild?.id, {
				place: user.tag,
				amountOfMessages: archiveUserData.length,
				searchAmount: amount,
			}),
			files: [
				{
					attachment: `${__dirname}/../../../../files/archive-data-${interaction.guild?.id}-${user.id}.txt`,
					name: "archive.txt",
				},
			],
		}));
	}
}

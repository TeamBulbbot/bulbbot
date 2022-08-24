import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, Guild, GuildChannel } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFile } from "fs/promises";
import moment from "moment";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ChannelType } from "discord-api-types/v10";
import { filesDir } from "../../..";

const { getChannelArchive }: DatabaseManager = new DatabaseManager();

export default class ArchiveChannel extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "channel",
			description: "Receive the archive of a channel",
			options: [
				{
					name: "channel",
					description: "The channel to get the archive of",
					type: ApplicationCommandOptionType.Channel,
					channel_types: [ChannelType.GuildText],
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const channel = interaction.options.getChannel("channel") as Exclude<GuildChannel, null>;
		const amount = interaction.options.getInteger("amount") || 100;

		await interaction.reply({
			content: await this.client.bulbutils.translate("archive_started_search", interaction.guild?.id, {}),
			ephemeral: true,
		});

		let archive: string = await this.client.bulbutils.translate("archive_header_format", interaction.guild?.id, {});
		let temp: string;
		const archiveChannelData = await getChannelArchive(channel.id, interaction.guild as Guild, amount);
		if (archiveChannelData.length === 0) return void (await interaction.editReply(await this.client.bulbutils.translate("archive_no_data_found", interaction.guild?.id, {})));

		archiveChannelData.forEach((message) => {
			temp = `[${moment(message.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}] ${message.channelId}-${message.messageId} | ${message.authorTag} (${message.authorId}): `;
			if (message.content) temp += `C: ${message.content}\n`;
			else if (message.sticker) temp += `S: ${message.sticker}\n`;
			if (message.embed) temp += `E: ${JSON.stringify(message.embed)}\n`;
			if (message.attachments.length > 0) temp += `A: ${message.attachments.join("\n")}\n`;

			archive += `${temp}`;
		});

		await writeFile(`${filesDir}/archive-data-${interaction.guild?.id}-${channel.id}.txt`, archive);
		await interaction.editReply(await this.client.bulbutils.translate("global_message_dismiss", interaction.guild?.id, {}));
		return void (await interaction.followUp({
			content: await this.client.bulbutils.translate("archive_success", interaction.guild?.id, {
				place: channel.id,
				amountOfMessages: archiveChannelData.length,
				searchAmount: amount,
			}),
			files: [
				{
					attachment: `${filesDir}/archive-data-${interaction.guild?.id}-${channel.id}.txt`,
					name: "archive.txt",
				},
			],
		}));
	}
}

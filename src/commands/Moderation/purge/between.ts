import { Collection, CommandInteraction, GuildTextBasedChannel, Message, Snowflake } from "discord.js";
import moment from "moment";
import { writeFile } from "fs/promises";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { NonDigits } from "../../../utils/Regex";
import { filesDir } from "../../..";

const loggingManager: LoggingManager = new LoggingManager();

export default class PurgeBetween extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "between",
			description: "Purge messages from a channel between two messages.",
			options: [
				{
					name: "message1",
					description: "The ID of the first message where to begin the purge.",
					type: ApplicationCommandOptionType.String,
					required: true,
					min_length: 17,
					max_length: 19,
				},
				{
					name: "message2",
					description: "The ID of the last message where to end the purge.",
					type: ApplicationCommandOptionType.String,
					required: true,
					min_length: 17,
					max_length: 19,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const message1 = (interaction.options.getString("message1") as string).replace(NonDigits, "");
		const message2 = (interaction.options.getString("message2") as string).replace(NonDigits, "");

		const msgs: Collection<string, Message> = await (interaction.channel as GuildTextBasedChannel)?.messages.fetch({ limit: 100 });
		const allMessages: Message[] = msgs.map((m: Message) => m).reverse();
		const messages: Snowflake[] = [];

		let delMsgs = await this.client.bulbutils.translate("purge_message_log", interaction.guild?.id, {
			user: interaction.user,
			channel: interaction.channel as GuildTextBasedChannel,
			timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
		});

		try {
			(await interaction.channel?.messages.fetch(message1)) as Message;
			(await interaction.channel?.messages.fetch(message2)) as Message;
		} catch (_) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found.message", interaction.guild?.id, {}),
				ephemeral: true,
			});
		}

		let counting = false;
		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (const msg of allMessages) {
			if (msg.id === message1) {
				counting = true;
			}

			if (counting) {
				if (moment(msg.createdAt).unix() < twoWeeksAgo) msgs.delete(msg.id);
				messages.push(msg.id);
				delMsgs += `${moment(msg.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${msg.author.tag} (${msg.author.id}) | ${msg.id} | ${msg.content} |\n`;
			}

			if (msg.id === message2) counting = false;
		}

		await (interaction.channel as GuildTextBasedChannel)?.bulkDelete(messages);

		await writeFile(`${filesDir}/PURGE-${interaction.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(
			this.client,
			interaction.guild,
			"purge",
			messages.length,
			`${filesDir}/PURGE-${interaction.guild?.id}.txt`,
			interaction.channel as GuildTextBasedChannel,
			interaction.user,
		);

		return interaction.reply(await this.client.bulbutils.translate("purge_success", interaction.guild?.id, { count: messages.length }));
	}
}

import { Collection, CommandInteraction, GuildTextBasedChannel, Message } from "discord.js";
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

export default class PurgeUntil extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "until",
			description: "Purge messages from a channel until a certain message.",
			options: [
				{
					name: "message",
					description: "The ID of the message to purge until.",
					type: ApplicationCommandOptionType.String,
					required: true,
					min_length: 17,
					max_length: 19,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let amount = 0;
		let deletedAmount = 0;
		let msg: Message;
		let deletedMessage = false;
		let temp: number;
		const messageId = interaction.options.getString("message") as string;

		try {
			msg = (await interaction.channel?.messages.fetch(messageId.replace(NonDigits, ""))) as Message;
		} catch (_) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found.message", interaction.guild?.id, {}),
				ephemeral: true,
			});
		}

		let delMsgs = await this.client.bulbutils.translate("purge_message_log", interaction.guild?.id, {
			user: interaction.user,
			channel: interaction.channel as GuildTextBasedChannel,
			timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
		});
		const twoWeeksAgo = moment().subtract(14, "days").unix();

		while (amount < 500) {
			temp = 0;
			let msgs: Collection<string, Message> = await (interaction.channel as GuildTextBasedChannel).messages.fetch({
				limit: 100,
			});

			const found = msgs.find((m: Message) => {
				temp++;
				return m.id === msg.id;
			});
			if (found) {
				deletedMessage = true;
				msgs = await (interaction.channel as GuildTextBasedChannel).messages.fetch({
					limit: temp,
				});
				deletedAmount += temp;
				amount = 500;
			} else deletedAmount += 100;
			msgs.map((m: Message) => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
			});
			await (interaction.channel as GuildTextBasedChannel)?.bulkDelete(msgs);
			amount += 100;
		}

		if (!deletedMessage)
			return interaction.reply({
				content: await this.client.bulbutils.translate("purge_message_failed_to_delete", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await writeFile(`${filesDir}/PURGE-${interaction.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(
			this.client,
			interaction.guild,
			"purge",
			deletedAmount,
			`${filesDir}/PURGE-${interaction.guild?.id}.txt`,
			interaction.channel as GuildTextBasedChannel,
			interaction.user,
		);

		return interaction.reply(await this.client.bulbutils.translate("purge_success", interaction.guild?.id, { count: deletedAmount }));
	}
}

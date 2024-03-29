import { Collection, CommandInteraction, Guild, GuildTextBasedChannel, Message, Snowflake } from "discord.js";
import moment from "moment";
import { writeFile } from "fs/promises";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { filesDir } from "../../..";

const loggingManager: LoggingManager = new LoggingManager();

export default class PurgeBots extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "bots",
			description: "Purges bot messages from the current channel.",
			options: [
				{
					name: "amount",
					description: "The amount of messages to purge.",
					type: ApplicationCommandOptionType.Integer,
					required: true,
					min_value: 2,
					max_value: 499,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let amount = interaction.options.getInteger("amount") as number;

		const deleteMsg: number[] = [];
		let a = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs = await this.client.bulbutils.translate("purge_message_log", interaction.guild?.id, {
			user: interaction.user,
			channel: interaction.channel as GuildTextBasedChannel,
			timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
		});

		const messagesToPurge: Snowflake[] = [];
		amount = 0;

		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await (interaction.channel as GuildTextBasedChannel)?.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async (m: Message) => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				if (m.author.bot) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await (interaction.channel as GuildTextBasedChannel)?.bulkDelete(messagesToPurge);

		await writeFile(`${filesDir}/PURGE-${interaction.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(
			this.client,
			interaction.guild as Guild,
			"purge",
			amount,
			`${filesDir}/PURGE-${interaction.guild?.id}.txt`,
			interaction.channel as GuildTextBasedChannel,
			interaction.user,
		);

		return interaction.reply(await this.client.bulbutils.translate("purge_success", interaction.guild?.id, { count: amount }));
	}
}

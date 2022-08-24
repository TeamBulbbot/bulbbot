import ApplicationCommand from "../../structures/ApplicationCommand";
import BulbBotClient from "../../structures/BulbBotClient";
import { ApplicationCommandType } from "discord-api-types/v10";
import { Collection, ContextMenuInteraction, GuildTextBasedChannel, Message, Snowflake, User } from "discord.js";
import moment from "moment";
import { writeFile } from "fs/promises";
import LoggingManager from "../../utils/managers/LoggingManager";
import { filesDir } from "../..";

const loggingManager: LoggingManager = new LoggingManager();

export default class ContextClean extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "Clean all Messages",
			type: ApplicationCommandType.User,
			description: "",
			options: null,
			command_permissions: ["MANAGE_MESSAGES"],
		});
	}

	public async run(interaction: ContextMenuInteraction): Promise<void> {
		const target = (await this.client.bulbfetch.getUser(interaction.targetId)) as User;

		let amount = 100;
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

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await (interaction.channel as GuildTextBasedChannel)?.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async (m: Message) => {
				if (target.id === m.author.id) {
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
			interaction.guild,
			"Purge",
			amount,
			`${filesDir}/PURGE-${interaction.guild?.id}.txt`,
			interaction.channel as GuildTextBasedChannel,
			interaction.user,
		);

		await interaction.reply({ content: await this.client.bulbutils.translate("purge_success", interaction.guild?.id, { count: amount }), ephemeral: true });
	}
}

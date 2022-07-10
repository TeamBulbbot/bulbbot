import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { haveAccessToPool, deletePool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();
const { sendEventLog }: LoggingManager = new LoggingManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "delete",
			description: "Delete a banpool",
			options: [
				{
					name: "name",
					description: "The name of the banpool",
					type: ApplicationCommandOptionType.String,
					required: true,
					max_length: 255,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const name: string = interaction.options.getString("name") as string;

		if (!(await hasBanpoolLog(interaction.guild?.id as Snowflake)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_logging", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!(await haveAccessToPool(interaction.guild?.id as Snowflake, name)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_access_not_found", interaction.guild?.id, {
					pool: name,
				}),
				ephemeral: true,
			});

		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		await interaction.reply({
			content: await this.client.bulbutils.translate("banpool_delete_message", interaction.guild?.id, {}),
			components: [row],
			ephemeral: true,
		});

		const collector = interaction.channel?.createMessageComponentCollector({ time: 30000 });

		collector?.on("collect", async (i: ButtonInteraction) => {
			if (i.customId === "confirm") {
				collector?.stop("clicked");

				await deletePool(name);

				await sendEventLog(
					this.client,
					interaction.guild,
					"banpool",
					await this.client.bulbutils.translate("banpool_delete_success_log", interaction.guild?.id, {
						user: interaction.user,
						name,
					}),
				);

				await interaction.editReply({
					content: await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}),
					components: [],
				});
				return i.reply({
					content: await this.client.bulbutils.translate("banpool_delete_success", interaction.guild?.id, {
						name,
					}),
					components: [],
				});
			} else {
				collector.stop("clicked");
				return void (await interaction.editReply({ content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}), components: [] }));
			}
		});

		collector?.on("end", async (_: ButtonInteraction, reason: string) => {
			if (reason !== "time") return;

			return void (await interaction.editReply({ content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}), components: [] }));
		});
	}
}

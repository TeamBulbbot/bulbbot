import { ButtonInteraction, CommandInteraction, Guild, Interaction, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { isGuildInPool, haveAccessToPool, leavePool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class BanpoolRemove extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "remove",
			description: "Remove a selected guild from a banpool",
			options: [
				{
					name: "guild_id",
					description: "The ID of the guild to remove",
					type: ApplicationCommandOptionType.String,
					required: true,
					min_length: 17,
					max_length: 19,
				},
				{
					name: "name",
					description: "The name of the banpool to remove the guild from",
					type: ApplicationCommandOptionType.String,
					required: true,
					max_length: 255,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const guildId: string = interaction.options.getString("guild_id") as string;
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
		if (!(await isGuildInPool(guildId, name)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_remove_not_found", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (guildId === interaction.guild?.id)
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_remove_self", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		await interaction.reply({
			content: await this.client.bulbutils.translate("banpool_remove_message", interaction.guild?.id, {}),
			components: [row],
			ephemeral: true,
		});

		const filter = (i: Interaction) => interaction.user.id === i.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 30000, componentType: "BUTTON" });

		collector?.on("collect", async (i: ButtonInteraction) => {
			if (i.customId === "confirm") {
				collector.stop("clicked");

				await leavePool(guildId, name);
				const guild: Guild = await this.client.guilds.fetch(guildId);

				await sendEventLog(
					this.client,
					guild,
					"banpool",
					await this.client.bulbutils.translate("banpool_remove_log_kicked", interaction.guild?.id, {
						name,
					}),
				);

				await sendEventLog(
					this.client,
					interaction.guild,
					"banpool",
					await this.client.bulbutils.translate("banpool_remove_log", interaction.guild?.id, {
						user: interaction.user,
						guild,
						name,
					}),
				);

				await interaction.editReply({
					content: await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}),
					components: [],
				});
				return i.reply(await this.client.bulbutils.translate("banpool_remove_success", interaction.guild?.id, {}));
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

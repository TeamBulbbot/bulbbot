import { ButtonInteraction, CommandInteraction, Guild, Interaction, MessageActionRow, MessageButton } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";
import LoggingManager from "../../utils/managers/LoggingManager";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const { sendModActionPreformatted }: LoggingManager = new LoggingManager();

export default class Prune extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Prune users from the server",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "days",
					description: "The number of days to prune",
					type: ApplicationCommandOptionType.Integer,
					required: true,
					min_value: 1,
					max_value: 30,
				},
				{
					name: "roles",
					description: "The roles included in the prune",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
				{
					name: "reason",
					description: "The reason for the prune",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			command_permissions: ["MANAGE_GUILD", "KICK_MEMBERS"],
			client_permissions: ["KICK_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const days = interaction.options.getInteger("days") as number;
		const roles =
			interaction.options
				.getString("roles")
				?.match(NonDigits)
				?.map((r) => r.replace(NonDigits, "")) ?? [];
		const reason = interaction.options.getString("reason") || (await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		const prunesize = await interaction.guild?.members.prune({
			days,
			roles,
			dry: true,
		});

		if (prunesize === 0)
			return interaction.reply({
				content: await this.client.bulbutils.translate("prune_no_users", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		await interaction.reply({
			content: await this.client.bulbutils.translate("prune_confirm_prune", interaction.guild?.id, { prunesize }),
			components: [row],
			ephemeral: true,
		});

		const filter = (i: Interaction) => interaction.user.id === i.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 30_000, componentType: "BUTTON" });

		collector?.on("collect", async (i: ButtonInteraction) => {
			if (i.customId === "confirm") {
				const prune = await interaction.guild?.members.prune({
					days,
					roles,
					count: true,
					reason,
				});

				await i.reply({
					components: [],
					content: await this.client.bulbutils.translate("prune_successful", interaction.guild?.id, { prune }),
				});

				await interaction.editReply({
					content: await this.client.bulbutils.translate("global_message_dismiss", interaction.guild?.id, {}),
					components: [],
				});

				await sendModActionPreformatted(
					this.client,
					interaction.guild as Guild,
					await this.client.bulbutils.translate("prune_log", interaction.guild?.id, {
						user: interaction.user,
						prune,
						reason,
						days,
						roles: roles.map((r) => `<@&${r}>`).join(" "),
					}),
				);

				return collector.stop("clicked");
			} else {
				collector.stop("clicked");
				return void (await interaction.editReply({
					content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}),
					components: [],
				}));
			}
		});

		collector?.on("end", async (_: ButtonInteraction, reason: string) => {
			if (reason !== "time") return;

			return void (await interaction.editReply({ content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}), components: [] }));
		});
	}
}

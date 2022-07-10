import DatabaseManager from "../../utils/managers/DatabaseManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { ButtonInteraction, CommandInteraction, Guild, Interaction, MessageActionRow, MessageButton } from "discord.js";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Clears the selected amount of messages from our message database",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "days",
					type: ApplicationCommandOptionType.Integer,
					description: "The amount of days to clear messages from",
					required: true,
					min_value: 1,
					max_value: 30,
				},
			],
			ownerOnly: true,
			command_permissions: ["ADMINISTRATOR"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const days: number = interaction.options.getInteger("days") as number;

		if (interaction.user.id !== interaction.guild?.ownerId)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_command_owner_only", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const amountOfMessages = (await databaseManager.getServerArchive(interaction.guild as Guild, days)).length;
		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		if (amountOfMessages === 0)
			return interaction.reply({
				content: await this.client.bulbutils.translate("messageclear_found_no_message", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await interaction.reply({
			content: await this.client.bulbutils.translate("messageclear_about_to_clear", interaction.guild?.id, {
				messages: amountOfMessages,
			}),
			components: [row],
			ephemeral: true,
		});

		const filter = (i: Interaction) => interaction.user.id === i.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 30_000, componentType: "BUTTON" });

		collector?.on("collect", async (i: ButtonInteraction) => {
			if (i.customId === "confirm") {
				collector.stop("clicked");
				await databaseManager.purgeMessagesInGuild(interaction.guild as Guild, days);

				await interaction.editReply(await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}));
				return void (await interaction.followUp({
					content: await this.client.bulbutils.translate("messageclear_success_delete", interaction.guild?.id, { messages: amountOfMessages }),
				}));
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

			await interaction.editReply({ content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}), components: [] });
			return;
		});
	}
}

import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction } from "discord.js";
import ReminderManager from "../../../utils/managers/ReminderManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const reminderManager: ReminderManager = new ReminderManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "delete",
			description: "Delete a reminder.",
			options: [
				{
					name: "id",
					description: "The ID of the reminder to delete.",
					type: ApplicationCommandOptionType.Integer,
					required: true,
					min_value: 1,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const reminderId: number = interaction.options.getInteger("id") as number;
		const allowedToDelete = await reminderManager.deleteUserReminder(reminderId, interaction.user.id);

		if (!allowedToDelete)
			return interaction.reply({
				content: await this.client.bulbutils.translate("remind_remove_unable_to_find", interaction.guild?.id, {
					reminderId,
				}),
				ephemeral: true,
			});
		else
			return interaction.reply({
				content: await this.client.bulbutils.translate("remind_remove_removed", interaction.guild?.id, { reminderId }),
				ephemeral: true,
			});
	}
}

import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
import ReminderManager from "../../../utils/managers/ReminderManager";
import * as Emotes from "../../../emotes.json";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";

const { listUserReminders }: ReminderManager = new ReminderManager();

export default class ReminderList extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "list",
			description: "Lists all of your reminders.",
			options: [],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const options: any[] = [];
		const reminders: any = await listUserReminders({ userId: interaction.user.id, pageSize: 10 });

		if (!reminders.length)
			return interaction.reply({
				content: await this.client.bulbutils.translate("remind_list_none", interaction.guild?.id, {}),
				ephemeral: true,
			});

		for (let i = 0; i < 25; i++) {
			if (reminders?.[i] === undefined) continue;

			options.push({
				label: `Reminder #${reminders[i].id}`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", interaction.guild?.id, {}),
				value: `${interaction.user.id}_${reminders[i].id}`,
				emoji: Emotes.other.REMIND,
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("remind_placeholder", interaction.guild?.id, {}))
				.setCustomId("reminders")
				.addOptions(options),
		);

		return interaction.reply({
			content: await this.client.bulbutils.translate("remind_prompt", interaction.guild?.id, { user: interaction.user }),
			components: [row],
			ephemeral: true,
		});
	}
}

import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageActionRow, MessageSelectMenu } from "discord.js";
import ReminderManager from "../../../utils/managers/ReminderManager";
import * as Emotes from "../../../emotes.json";

const { listUserReminders }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
			description: "Lists all of your reminders.",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		const options: any[] = [];
		const reminders: any = await listUserReminders({ userId: context.author.id, limit: 10 });
		if (!reminders.length) return await context.channel.send(await this.client.bulbutils.translate("remind_list_none", context.guild?.id, {}));

		for (let i = 0; i < 25; i++) {
			if (reminders?.[i] === undefined) continue;

			options.push({
				label: `Reminder #${reminders[i].id}`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", context.guild?.id, {}),
				value: `${context.author.id}_${reminders[i].id}`,
				emoji: Emotes.other.REMIND,
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("remind_placeholder", context.guild?.id, {}))
				.setCustomId("reminders")
				.addOptions(options),
		);

		return context.channel.send({ content: await this.client.bulbutils.translate("remind_prompt", context.guild?.id, { user: context.author }), components: [row] });
	}
}

import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, MessageActionRow, MessageSelectMenu } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import ReminderManager from "../../../utils/managers/ReminderManager";
import * as Emotes from "../../../emotes.json";

const { listUserReminders }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
		});
	}

	public async run(message: Message): Promise<void | Message> {
		let options: any[] = [];
		const reminders: any = await listUserReminders(message.author.id);
		if (!reminders.length) return await message.channel.send(await this.client.bulbutils.translate("remind_list_none", message.guild?.id, {}))

		for (let i = 0; i < 25; i++) {
			if (reminders?.[i] === undefined) continue;

			options.push({
				label: `Reminder #${i + 1}`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", message.guild?.id, {}),
				value: `${message.author.id}_${reminders[i].id}`,
				emoji: Emotes.other.REMIND,
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("remind_placeholder", message.guild?.id, {}))
				.setCustomId("reminders")
				.addOptions(options),
		);

		return message.channel.send({ content: await this.client.bulbutils.translate("remind_prompt", message.guild?.id, { user: message.author }), components: [row] });
	}
}

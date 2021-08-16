import ReminderManager from "./managers/ReminderManager";
import { Message, User } from "discord.js";
import moment from "moment";
import BulbBotClient from "../structures/BulbBotClient";

const { getAllReminders, deleteReminder, getReminder }: ReminderManager = new ReminderManager();

export default class {
	async loadReminders(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - REMINDERS] Starting to load reminders...");
		const reminders: any = await getAllReminders();
		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];

			if ((reminder.expireTime - Math.floor(Date.now() / 1000)) * 1000 < 0) client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Old reminder, sending it out now to ${reminder.userId}`);

			setTimeout(async () => {
				if (!(await getReminder(reminder.id))) return deleteReminder(reminder.id);

				if (reminder.channelId !== "") {
					// @ts-ignore
					const channel: TextChannel = await client.channels.fetch(reminder.channelId);
					const message: Message = await channel.messages.fetch(reminder.messageId);

					message.reply({
						content: `⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
						allowedMentions: {
							repliedUser: true,
							users: [message.author.id],
						},
					});
				} else {
					const user: User = await client.users.fetch(reminder.userId);

					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``).catch(_ => {
						client.log.info(`[REMIND - DM] Unable to dm ${user.tag} (${user.id}) with the reminder of ${reminder.reason}`);
					});
				}

				deleteReminder(reminder.id);
			}, (reminder.expireTime - Math.floor(Date.now() / 1000)) * 1000);
		}

		client.log.client(`[CLIENT - REMINDERS] Successfully handled ${reminders.length} reminder(s)`);
	}
}

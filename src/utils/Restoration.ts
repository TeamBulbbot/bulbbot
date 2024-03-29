import ReminderManager from "./managers/ReminderManager";
import InfractionsManager from "./managers/InfractionsManager";
import TempbanManager from "./managers/TempbanManager";
import { Guild, User } from "discord.js";
import moment from "moment";
import BulbBotClient from "../structures/BulbBotClient";
import { BanType } from "./types/BanType";
import { setTimeout } from "safe-timers";

const { getAllReminders, deleteReminder, getReminder }: ReminderManager = new ReminderManager();
const { getAllTemBans, deleteTempBan }: TempbanManager = new TempbanManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async loadReminders(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - REMINDERS] Starting to restore reminders...");
		const reminders = await getAllReminders();
		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			if ((parseInt(reminder.expireTime.toString()) - Math.floor(Date.now() / 1000)) * 1000 < 0)
				client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Old reminder, sending it out now to ${reminder.userId}`);

			setTimeout(async () => {
				if (!(await getReminder(reminder.id))) {
					await deleteReminder(reminder.id);
					return;
				}

				if (reminder.channelId !== "") {
					// @ts-expect-error
					let channel: TextChannel;

					try {
						channel = await client.channels.fetch(reminder.channelId as string);
					} catch (_) {
						client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Bot was was unable to find the channel: ${reminder.channelId}`);
						return;
					}

					channel.send({
						content: `⏰ <@${reminder.userId}> reminder from **${moment(Date.parse(reminder.createdAt.toString())).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
						allowedMentions: {
							users: [reminder.userId],
						},
					});
				} else {
					const user: User = await client.users.fetch(reminder.userId);

					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt.toString())).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``).catch((_) => {
						client.log.info(`[REMIND - DM] Unable to dm ${user.tag} (${user.id}) with the reminder of ${reminder.reason}`);
					});
				}

				await deleteReminder(reminder.id);
			}, Math.max((parseInt(reminder.expireTime.toString()) - Math.floor(Date.now() / 1000)) * 1000, 0));
		}

		client.log.client(`[CLIENT - REMINDERS] Successfully handled ${reminders.length} reminder(s)`);
	}

	async loadTempBans(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - TEMP BANS] Starting to restore temp bans...");
		const tempbans = await getAllTemBans();
		for (let i = 0; i < tempbans.length; i++) {
			const tempban = tempbans[i];
			let guild: Guild;
			try {
				guild = await client.guilds.fetch(tempban.guildId);
			} catch (_) {
				client.log.client(`[CLIENT - TEMP BANS] [#${tempban.id}] Bot was kicked from the guild, can't unban the user: ${tempban.targetId}`);
				await deleteTempBan(tempban.id);
				continue;
			}

			let target: User;
			try {
				target = await client.users.fetch(tempban.targetId);
			} catch (error) {
				client.log.client(`[CLIENT - TEMP BANS] [#${tempban.id}] Bot was was unable to find the user: ${tempban.targetId} in guild: ${guild.id}`);
				await deleteTempBan(tempban.id);
				continue;
			}

			setTimeout(async () => {
				if (!guild.me || !client.user) return;

				await infractionsManager.unban(
					client,
					guild,
					BanType.TEMP,
					target,
					guild.me,
					await client.bulbutils.translate("global_mod_action_log", guild.id, {
						action: await client.bulbutils.translate("mod_action_types.auto_unban", guild.id),
						moderator: client.user,
						target: target,
						reason: "Automatic unban",
					}),
					"Automatic unban",
				);

				await deleteTempBan(tempban.id);
			}, Math.max((parseInt(tempban.expireTime.toString()) - Math.floor(Date.now() / 1000)) * 1000, 0));
		}

		client.log.client(`[CLIENT - TEMP BANS] Successfully handled ${tempbans.length} temp bans(s)`);
	}
}

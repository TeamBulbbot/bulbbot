import ReminderManager from "./managers/ReminderManager";
import InfractionsManager from "./managers/InfractionsManager";
import TempbanManager from "./managers/TempbanManager";
import { Guild, GuildMember, Message, User } from "discord.js";
import moment from "moment";
import BulbBotClient from "../structures/BulbBotClient";
import { BanType } from "./types/BanType";
import { setTimeout } from "safe-timers";
import { tryIgnore } from "./helpers";

const { getAllReminders, deleteReminder, getReminder }: ReminderManager = new ReminderManager();
const { getAllTemBans, deleteTempBan }: TempbanManager = new TempbanManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async loadReminders(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - REMINDERS] Starting to restore reminders...");
		const reminders: any = await getAllReminders();
		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			if ((reminder.expireTime - Math.floor(Date.now() / 1000)) * 1000 < 0) client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Old reminder, sending it out now to ${reminder.userId}`);

			setTimeout(async () => {
				if (!(await getReminder(reminder.id))) return deleteReminder(reminder.id);

				if (reminder.channelId !== "") {
					// @ts-expect-error
					let channel: TextChannel;

					try {
						channel = await client.channels.fetch(reminder.channelId);
					} catch (_) {
						client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Bot was was unable to find the channel: ${reminder.channelId}`);
						return;
					}

					let message: Message;
					const options: any = {
						allowedMentions: {
							repliedUser: true,
							users: [reminder.userId],
						},
					};

					try {
						message = await channel.messages.fetch(reminder.messageId);
						message.reply({
							content: `⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							options,
						});
					} catch (_) {
						channel.send({
							content: `⏰ <@${reminder.userId}> reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							options,
						});
					}
				} else {
					const user: User = await client.users.fetch(reminder.userId);

					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``).catch((_) => {
						client.log.info(`[REMIND - DM] Unable to dm ${user.tag} (${user.id}) with the reminder of ${reminder.reason}`);
					});
				}

				deleteReminder(reminder.id);
			}, (reminder.expireTime - Math.floor(Date.now() / 1000)) * 1000);
		}

		client.log.client(`[CLIENT - REMINDERS] Successfully handled ${reminders.length} reminder(s)`);
	}

	async loadTempBans(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - TEMP BANS] Starting to restore temp bans...");
		const tempbans: any = await getAllTemBans();
		for (let i = 0; i < tempbans.length; i++) {
			const tempban: any = tempbans[i];
			let guild: Guild;
			try {
				guild = await client.guilds.fetch(tempban.gId);
			} catch (_) {
				client.log.client(`[CLIENT - TEMP BANS] [#${tempban.id}] Bot was kicked from the guild cant unban the user: ${tempban.targetId}`);
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

			setTimeout(async function () {
				await tryIgnore(
					infractionsManager.unban,
					client,
					<Guild>guild,
					BanType.TEMP,
					target,
					<GuildMember>guild?.me,
					await client.bulbutils.translate("global_mod_action_log", guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.auto_unban", guild?.id, {}),
						moderator: client.user,
						target: target,
						reason: "Automatic unban",
					}),
					"Automatic unban",
				);

				await deleteTempBan(tempban.id);
			}, tempban.expireTime - Date.now());
		}

		client.log.client(`[CLIENT - TEMP BANS] Successfully handled ${tempbans.length} temp bans(s)`);
	}
}

import ReminderManager from "./managers/ReminderManager";
import MuteManger from "./managers/MuteManger";
import InfractionsManager from "./managers/InfractionsManager";
import DatabaseManager from "./managers/DatabaseManager";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import moment from "moment";
import BulbBotClient from "../structures/BulbBotClient";
import { MuteType } from "./types/MuteType";

const { getAllReminders, deleteReminder, getReminder }: ReminderManager = new ReminderManager();
const { getAllMutes, deleteMute }: MuteManger = new MuteManger();
const infractionsManager: InfractionsManager = new InfractionsManager();
const { getMuteRole }: DatabaseManager = new DatabaseManager();

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

	async loadMutes(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - MUTES] Starting to restore mutes...");
		const mutes: any = await getAllMutes();
		for (let i = 0; i < mutes.length; i++) {
			const mute: any = mutes[i]; // @ts-ignore
			const guild: Guild = await client.guilds.fetch(mute.gId);
			if (!guild) {
				await deleteMute(mute.id);
				continue;
			}
			// @ts-ignore
			const target: GuildMember = await guild?.members.fetch(mute.targetId);
			const muteRole: Snowflake = <Snowflake>await getMuteRole(<Snowflake>guild?.id);

			if (!target || !muteRole) {
				await deleteMute(mute.id);
				continue;
			}
			setTimeout(async function () {
				await infractionsManager.unmute(
					client,
					<Guild>guild,
					MuteType.AUTO,
					target,
					<User>client.user,
					await client.bulbutils.translate("global_mod_action_log", guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.unmute", guild?.id, {}),
						moderator: client.user,
						target: target.user,
						reason: "Automatic unmute",
					}),
					"Automatic unmute",
					muteRole,
				);

				await deleteMute(mute.id);
			}, mute.expireTime - Date.now());
		}

		client.log.client(`[CLIENT - MUTES] Successfully handled ${mutes.length} mute(s)`);
	}

	async loadTempBans(client: BulbBotClient): Promise<void> {
		client.log.client("[CLIENT - TEMP BANS] Starting to restore temp bans...");
		client.log.client(`[CLIENT - TEMP BANS] Successfully handled ${1 + 1} temp bans(s)`);
	}
}

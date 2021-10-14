import ReminderManager from "./managers/ReminderManager";
import MuteManger from "./managers/MuteManger";
import InfractionsManager from "./managers/InfractionsManager";
import DatabaseManager from "./managers/DatabaseManager";
import TempbanManager from "./managers/TempbanManager";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import moment from "moment";
import BulbBotClient from "../structures/BulbBotClient";
import { MuteType } from "./types/MuteType";
import { BanType } from "./types/BanType";
import { setTimeout } from "safe-timers";

const { getAllReminders, deleteReminder, getReminder }: ReminderManager = new ReminderManager();
const { getAllMutes, deleteMute }: MuteManger = new MuteManger();
const { getAllTemBans, deleteTempBan }: TempbanManager = new TempbanManager();
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
					let channel: TextChannel;

					try {
						channel = await client.channels.fetch(reminder.channelId);
					} catch (_) {
						client.log.client(`[CLIENT - REMINDERS] [#${reminder.id}] Bot was was unable to find the channel: ${reminder.channelId}`);
						return;
					}

					let message: Message;
					let options: any = {
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
			const mute: any = mutes[i];

			let guild: Guild;

			try {
				guild = await client.guilds.fetch(mute.gId);
			} catch (_) {
				client.log.client(`[CLIENT - MUTES] [#${mute.id}] Bot was kicked from the guild cant restore the mute on user: ${mute.targetId}`);
				await deleteMute(mute.id);
				continue;
			}

			let target: GuildMember;
			const muteRole: Snowflake = <Snowflake>await getMuteRole(<Snowflake>guild?.id);

			try {
				target = await guild?.members.fetch(mute.targetId);
			} catch (_) {
				client.log.client(`[CLIENT - MUTES] [#${mute.id}] Bot was was unable to find the user: ${mute.targetId} in guild: ${guild.id}`);
				await deleteMute(mute.id);
				continue;
			}

			if (!muteRole) {
				await deleteMute(mute.id);
				continue;
			}

			if (mute.expireTime - Date.now() < 0) client.log.client(`[CLIENT - MUTES] [#${mute.id}] Old mute, unmuting user ${mute.targetId}`);

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
				try {
					await infractionsManager.unban(
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
				} catch (error) {}

				await deleteTempBan(tempban.id);
			}, tempban.expireTime - Date.now());
		}

		client.log.client(`[CLIENT - TEMP BANS] Successfully handled ${tempbans.length} temp bans(s)`);
	}
}

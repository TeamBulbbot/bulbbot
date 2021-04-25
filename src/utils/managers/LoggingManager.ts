import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, TextChannel, User } from "discord.js";
import DatabaseManager from "./DatabaseManager";
import * as Emotes from "../../emotes.json";
import moment, { MomentInput } from "moment";
import "moment-timezone";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class {
	async sendModAction(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		const dbGuild: object = databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa zz"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infID,
				action: action,
				emoji: this.betterActions(action),
			}),
		);
	}

	async sendAutoUnban(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_unban_auto", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infID,
				action: action,
				emoji: this.betterActions(action),
			}),
		);
	}

	async sendModActionTemp(
		client: BulbBotClient,
		guild: Guild,
		action: string,
		target: User,
		moderator: User,
		log: string,
		infID: number,
		until: MomentInput,
	): Promise<void> {
		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod_temp", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infID,
				action: action,
				until: moment(until).tz(zone).format("MMM Do YYYY, h:mm:ssa z"),
				emoji: this.betterActions(action),
			}),
		);
	}

	private betterActions(action: string): string {
		switch (action.toLowerCase()) {
			case "softbanned":
				action = `${Emotes.actions.BAN}`;
				break;
			case "banned":
				action = `${Emotes.actions.BAN}`;
				break;
			case "unbanned":
				action = `${Emotes.actions.UNBAN}`;
				break;
			case "force-banned":
				action = `${Emotes.actions.BAN}`;
				break;
			case "kicked":
				action = `${Emotes.actions.KICK}`;
				break;
			case "muted":
				action = `${Emotes.actions.MUTE}`;
				break;
			case "warned":
				action = `${Emotes.actions.WARN}`;
				break;
			case "unmuted":
				action = `${Emotes.actions.UNBAN}`;
				break;
			case "automatically unmuted":
				action = `${Emotes.actions.UNBAN}`;
				break;
			case "automatically unbanned":
				action = `${Emotes.actions.UNBAN}`;
				break;
			case "temp-banned":
				action = `${Emotes.actions.BAN}`;
				break;
			case "trash":
				action = `${Emotes.other.TRASH}`;
				break;
			default:
				break;
		}

		return action;
	}
}

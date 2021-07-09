import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, Snowflake, TextChannel, User } from "discord.js";
import DatabaseManager from "./DatabaseManager";
import * as Emotes from "../../emotes.json";
import moment, { MomentInput } from "moment";
import "moment-timezone";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class {
	public async sendModAction(client: BulbBotClient, guildID: Snowflake, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		const dbGuild: object = await databaseManager.getLoggingConfig(guildID);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guildID)];

		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod", guildID, {
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

	public async sendAutoUnban(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
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

	public async sendModActionFile(client: BulbBotClient, guild: Guild, action, amount, file, channel, moderator) {
		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${this.betterActions("trash")} **${moderator.tag}** \`(${moderator.id})\` has removed **${amount}** messages in <#${channel.id}>`,
			{
				files: [file],
			},
		);
	}

	public async sendModActionTemp(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number, until: MomentInput): Promise<void> {
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

	public async sendCommandLog(client: BulbBotClient, guild: Guild, moderator: User, channelID: Snowflake, command: string): Promise<void> {
		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild["other"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["other"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_command", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				channel_id: channelID,
				command: command,
			}),
		);
	}

	public async sendEventLog(client: BulbBotClient, guild: Guild, part: "message" | "member" | "role" | "channel" | "joinleave" | "automod", log: string): Promise<void> {
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const logChannel: Snowflake = <string>this.getPart(dbGuild, part);

		if (logChannel === null) return;
		await (<TextChannel>client.channels.cache.get(logChannel)).send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	public async sendServerEventLog(client: BulbBotClient, guild: Guild, log: string): Promise<void> {
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		const dbGuild: object = await databaseManager.getLoggingConfig(guild.id);
		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		if (!modChannel) return;
		await modChannel.send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	public async sendModActionPreformatted(client: BulbBotClient, guild: Guild, log: string) {
		const dbGuild: object = <object>await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		if (dbGuild["modAction"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["modAction"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	public async sendAutoModLog(client: BulbBotClient, guild: Guild, log: string) {
		const dbGuild: object = <object>await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		if (dbGuild["automod"] === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild["automod"]);
		if (!modChannel.guild.me?.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		await modChannel.send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	private getPart(dbGuild: object, part: string) {
		if (dbGuild === null) return null;
		switch (part.toLowerCase()) {
			case "message":
				part = dbGuild["message"];
				break;
			case "role":
				part = dbGuild["role"];
				break;
			case "member":
				part = dbGuild["member"];
				break;
			case "channel":
				part = dbGuild["channel"];
				break;
			case "joinleave":
				part = dbGuild["joinLeave"];
				break;
			case "automod":
				part = dbGuild["automod"];
				break;
			default:
				part = "";
				break;
		}

		return part;
	}

	private betterActions(action: string): string {
		switch (action) {
			case "soft-banned":
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

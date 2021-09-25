import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, MessageEmbed, NewsChannel, Snowflake, TextChannel, User } from "discord.js";
import DatabaseManager from "./DatabaseManager";
import * as Emotes from "../../emotes.json";
import { defaultPerms } from "../../Config";
import moment, { MomentInput } from "moment";
import "moment-timezone";
import LoggingConfiguration from "../types/LoggingConfiguration";
import { LoggingPartString } from "../types/LoggingPart";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class {
	public async sendModAction(client: BulbBotClient, guildID: Snowflake, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guildID);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guildID)];

		if (dbGuild.modAction === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.modAction);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod", guildID, {
				timestamp: moment().tz(zone).format("hh:mm:ssa zz"),
				target,
				moderator,
				reason: log,
				infraction_id: infID,
				action: action,
				emoji: await this.betterActions(client, guildID, action),
			}),
		);
	}

	public async sendAutoUnban(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild.modAction === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.modAction);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod_unban_auto", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target,
				moderator,
				reason: log,
				infraction_id: infID,
				action: action,
				emoji: await this.betterActions(client, guild.id, action),
			}),
		);
	}

	public async sendModActionFile(client: BulbBotClient, guild: Guild, action, amount, file, channel, moderator) {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild.modAction === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.modAction);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send({
			content: `\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${await this.betterActions(client, guild.id, "trash")} **${moderator.tag}** \`(${
				moderator.id
			})\` has removed **${amount}** messages in <#${channel.id}>`,
			files: [file],
		});
	}

	public async sendModActionTemp(client: BulbBotClient, guild: Guild, action: string, target: User, moderator: User, log: string, infID: number, until: MomentInput): Promise<void> {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (dbGuild.modAction === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.modAction);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod_temp", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target,
				moderator,
				reason: log,
				infraction_id: infID,
				action: action,
				until: moment(until).tz(zone).format("MMM Do YYYY, h:mm:ssa z"),
				emoji: await this.betterActions(client, guild.id, action),
			}),
		);
	}

	public async sendCommandLog(client: BulbBotClient, guild: Guild, moderator: User, channelID: Snowflake, command: string): Promise<void> {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];
		if (!dbGuild || dbGuild.other === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.other);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_command", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				user: moderator,
				channel: channelID,
				command: command,
			}),
		);
	}

	public async sendEventLog(client: BulbBotClient, guild: Guild, part: Exclude<LoggingPartString, "modAction">, log: string, extra: string | MessageEmbed[] | null = null): Promise<void> {
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const logChannelId: Snowflake = dbGuild[part];
		if (!logChannelId) return;
		const logChannel = client.channels.cache.get(logChannelId);

		if (!(logChannel instanceof TextChannel || logChannel instanceof NewsChannel)) return;
		if (!logChannel.guild.me?.permissionsIn(logChannel).has(defaultPerms)) return;

		await logChannel.send({
			content: `\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`,
			embeds: typeof extra !== "string" && extra !== null ? extra : [],
			files: typeof extra === "string" ? [extra] : undefined,
			allowedMentions: { parse: [] },
		});
	}

	public async sendModActionPreformatted(client: BulbBotClient, guild: Guild, log: string) {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		if (dbGuild.modAction === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.modAction);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	public async sendAutoModLog(client: BulbBotClient, guild: Guild, log: string) {
		const dbGuild: LoggingConfiguration = await databaseManager.getLoggingConfig(guild.id);
		const zone: string = client.bulbutils.timezones[await databaseManager.getTimezone(guild.id)];

		if (dbGuild.automod === null) return;

		const modChannel: TextChannel = <TextChannel>client.channels.cache.get(dbGuild.automod);
		if (!modChannel?.guild.me?.permissionsIn(modChannel).has(defaultPerms)) return;

		await modChannel.send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	}

	private async betterActions(client: BulbBotClient, guildID: Snowflake, action: string): Promise<string> {
		switch (action) {
			case await client.bulbutils.translate("mod_action_types.soft_ban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.ban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.force_ban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.temp_ban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.manual_ban", guildID, {}):
				action = `${Emotes.actions.BAN}`;
				break;

			case await client.bulbutils.translate("mod_action_types.kick", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.manual_kick", guildID, {}):
				action = `${Emotes.actions.KICK}`;
				break;

			case await client.bulbutils.translate("mod_action_types.mute", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.deafen", guildID, {}):
				action = `${Emotes.actions.MUTE}`;
				break;

			case await client.bulbutils.translate("mod_action_types.warn", guildID, {}):
				action = `${Emotes.actions.WARN}`;
				break;

			case await client.bulbutils.translate("mod_action_types.unban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.unmute", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.auto_unmute", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.auto_unban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.manual_unban", guildID, {}):
			case await client.bulbutils.translate("mod_action_types.undeafen", guildID, {}):
				action = `${Emotes.actions.UNBAN}`;
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

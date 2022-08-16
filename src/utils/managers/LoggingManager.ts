import BulbBotClient from "../../structures/BulbBotClient";
import { Channel, FileOptions, Guild, MessageEmbed, NewsChannel, Snowflake, TextChannel, User } from "discord.js";
import { databaseManager } from "./DatabaseManager";
import * as Emotes from "../../emotes.json";
import { defaultPerms } from "../../Config";
import moment, { MomentInput } from "moment";
import "moment-timezone";
import { LoggingPartString } from "../types/LoggingPart";
import { isGuildChannel } from "../typechecks";

const timestamp = (timezone: string) => moment().tz(timezone).format("hh:mm:ssa z");

export default class {
	public async sendModAction(client: BulbBotClient, guild: Maybe<Guild>, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		if (!guild) {
			return;
		}

		const { guildId, timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(guildLogging.modAction) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod", guildId, {
				timestamp: moment().tz(timezone).format("hh:mm:ssa zz"),
				target,
				moderator,
				reason: log,
				infraction_id: infID,
				action: action,
				emoji: await this.betterActions(client, guildId, action),
			}),
		);
	}

	public async sendAutoUnban(client: BulbBotClient, guild: Maybe<Guild>, action: string, target: User, moderator: User, log: string, infID: number): Promise<void> {
		if (!guild) {
			return;
		}

		const { guildId, timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(guildLogging.modAction) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod_unban_auto", guildId, {
				timestamp: timestamp(timezone),
				target,
				moderator,
				infraction_id: infID,
				action: action,
				emoji: await this.betterActions(client, guildId, action),
			}),
		);
	}

	// TODO: This is tightly coupled to the purge command, ideally it wouldn't need to be (or else would be named different)
	public async sendModActionFile(client: BulbBotClient, guild: Maybe<Guild>, action: string, amount: number, file: FileOptions["attachment"], channel: Channel, moderator: User): Promise<void> {
		if (!guild) {
			return;
		}

		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(guildLogging.modAction) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send({
			content: `\`[${timestamp(timezone)}]\` ${await this.betterActions(client, guild.id, "trash")} **${moderator.tag}** \`(${moderator.id})\` has removed **${amount}** messages in <#${channel.id}>`,
			files: [
				{
					attachment: file,
					name: `${action}.txt`,
				},
			],
		});
	}

	public async sendModActionTemp(client: BulbBotClient, guild: Maybe<Guild>, action: string, target: User, moderator: User, log: string, infID: number, until: MomentInput): Promise<void> {
		if (!guild) {
			return;
		}

		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(guildLogging.modAction) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_mod_temp", guild.id, {
				timestamp: timestamp(timezone),
				target,
				moderator,
				reason: log,
				infraction_id: infID,
				action: action,
				until: moment(until).tz(timezone).format("MMM Do YYYY, h:mm:ssa z"),
				emoji: await this.betterActions(client, guild.id, action),
			}),
		);
	}

	public async sendCommandLog(client: BulbBotClient, guild: Maybe<Guild>, moderator: User, channelID: Snowflake, command: string): Promise<void> {
		if (!guild) {
			return;
		}

		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (!guildLogging?.other) return;

		const modChannel = client.channels.cache.get(guildLogging.other) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send(
			await client.bulbutils.translate("global_logging_command", guild.id, {
				timestamp: timestamp(timezone),
				user: moderator,
				channel: channelID,
				command: command,
			}),
		);
	}

	public async sendEventLog(client: BulbBotClient, guild: Maybe<Guild>, part: LoggingPartString, log: string, extra: string | MessageEmbed[] | null = null): Promise<void> {
		// Really, we should probably be narrowing these types at the CommandContext level or something, e.g. we know in our usage that we don't
		// operate with DM commands so we already will have returned unless `guild`, `me`, etc. are defined
		if (!guild) return;
		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		const logChannelId = guildLogging[part];
		if (!logChannelId) return;
		const logChannel = client.channels.cache.get(logChannelId);

		if (!(logChannel instanceof TextChannel || logChannel instanceof NewsChannel)) return;
		if (!logChannel.guild.me?.permissionsIn(logChannel).has(defaultPerms)) return;

		await logChannel.send({
			content: `\`[${timestamp(timezone)}]\` ${log}`,
			embeds: typeof extra !== "string" && extra !== null ? extra : [],
			files: typeof extra === "string" ? [extra] : undefined,
			allowedMentions: { parse: [] },
		});
	}

	public async sendModActionPreformatted(client: BulbBotClient, guild: Maybe<Guild>, log: string) {
		if (!guild) {
			return;
		}
		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);
		if (guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(guildLogging.modAction) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		await modChannel.send(`\`[${timestamp(timezone)}]\` ${log}`);
	}

	public async sendAutoModLog(client: BulbBotClient, guild: Maybe<Guild>, log: string, buffer?: Buffer) {
		if (!guild) return;
		const { timezone, guildLogging } = await databaseManager.getCombinedLoggingConfig(guild);

		if (guildLogging.automod === null) return;

		const modChannel = client.channels.cache.get(guildLogging.automod) as Channel;
		if (!(isGuildChannel(modChannel) && modChannel.isText() && modChannel.guild.me?.permissionsIn(modChannel).has(defaultPerms))) return;

		let files: any = null;

		if (buffer)
			files = [
				{
					attachment: buffer,
					name: "avatar.png",
				},
			];

		await modChannel.send({
			content: `\`[${timestamp(timezone)}]\` ${log}`,
			files,
		});
	}

	private async betterActions(client: BulbBotClient, guildID: Maybe<Snowflake>, action: string): Promise<string> {
		switch (action) {
			case await client.bulbutils.translate("mod_action_types.pool_ban", guildID, {}):
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

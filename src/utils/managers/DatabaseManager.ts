import { sequelize } from "../database/connection";
import * as Config from "../../Config";
import { Guild, Message, MessageAttachment, Snowflake } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";
import AutoModPart, { AutoModAntiSpamPart, AutoModListPart } from "../types/AutoModPart";
import { AutoModListOperation, AutoModListOperationResult } from "../types/AutoModListOperation";
import PunishmentType from "../types/PunishmentType";
import { AutoModConfiguration, Blacklist, GuildConfiguration, LoggingConfiguration } from "../types/DatabaseStructures";

export default class {
	async createGuild(guild: Guild): Promise<void> {
		// if guild is already in db ignore
		if (
			(
				await sequelize.query('SELECT id FROM "guilds" WHERE "guildId" = $GuildID', {
					bind: { GuildID: guild.id },
					type: QueryTypes.SELECT,
				})
			).length > 0
		)
			return;
		const config = await sequelize.models.guildConfiguration.create({ prefix: Config.prefix });
		const logging = await sequelize.models.guildLogging.create({});
		const automod = await sequelize.models.automod.create({});

		await sequelize.models.guild.create({
			name: guild.name,
			guildId: guild.id,
			guildConfigurationId: config["id"],
			guildLoggingId: logging["id"],
			automodId: automod["id"],
		});
	}

	async deleteGuild(guildID: Snowflake): Promise<void> {
		await sequelize.query('DELETE FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM automods WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "guildLoggings" WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "messageLogs" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "banpools" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "guildModerationRoles" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "guildOverrideCommands" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM "tempbans" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});

		await sequelize.query('DELETE FROM guilds WHERE "guildId" = $GuildID', {
			bind: { GuildID: guildID },
			type: QueryTypes.DELETE,
		});
	}

	async getConfig(guildID: Snowflake): Promise<GuildConfiguration> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async getAutoModConfig(guildID: Snowflake): Promise<AutoModConfiguration> {
		const response: AutoModConfiguration[] = await sequelize.query('SELECT * FROM automods WHERE id = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async getFullGuildConfig(guildID: Snowflake) {
		return await sequelize.models.guild.findOne({
			where: { guildId: guildID },
			include: [
				{ model: sequelize.models.guildConfiguration },
				{ model: sequelize.models.guildLogging },
				{ model: sequelize.models.guildOverrideCommands },
				{ model: sequelize.models.guildModerationRoles },
				{ model: sequelize.models.automod },
				{ model: sequelize.models.infraction },
				{ model: sequelize.models.tempban },
				{ model: sequelize.models.banpools },
			],
		});
	}

	async setPrefix(guildId: Snowflake, prefix: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET prefix = $Prefix WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Prefix: prefix, GuildID: guildId },
			type: QueryTypes.UPDATE,
		});
	}

	async setActionsOnInfo(guildID: Snowflake, enabled: boolean): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "actionsOnInfo" = $Enabled WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	async setRolesOnLeave(guildID: Snowflake, enabled: boolean): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "rolesOnLeave" = $Enabled WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	async setPremium(guildID: Snowflake, premium: boolean): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "premiumGuild" = $Premium WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Premium: premium, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setMuteRole(guildID: Snowflake, muteRoleID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "muteRole" = $MuteRole WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { MuteRole: muteRoleID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setAutoRole(guildID: Snowflake, autoRoleID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "autorole" = $AutoRole WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { AutoRole: autoRoleID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setLanguage(guildID: Snowflake, language: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET language = $Lang WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Lang: language, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getTimezone(guildID: Snowflake): Promise<string> {
		const response: Record<string, any> = await sequelize.query('SELECT timezone FROM "guildConfigurations" WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0]["timezone"];
	}

	async setTimezone(guildID: Snowflake, timezone: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET timezone = $TZ WHERE id = (SELECT "guildConfigurationId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { TZ: timezone, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setModAction(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "modAction" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setBanpool(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "banpool" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setAutoMod(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET automod = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setMessage(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET message = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setRole(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET role = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setMember(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET member = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setChannel(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET channel = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setThread(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET thread = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setInvite(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET invite = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setJoinLeave(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "joinLeave" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async setOther(guildID: Snowflake, channelID: Snowflake | null): Promise<void> {
		await sequelize.query('UPDATE "guildLoggings" SET "other" = $ChannelID WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { ChannelID: channelID, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	async getLoggingConfig(guildID: Snowflake): Promise<LoggingConfiguration> {
		const response: LoggingConfiguration[] = await sequelize.query('SELECT * FROM "guildLoggings" WHERE id = (SELECT "guildLoggingId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async enableAutomod(guildID: Snowflake, enabled: boolean): Promise<void> {
		await sequelize.query('UPDATE automods SET enabled = $Enabled WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildID, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	// Append/Remove Abstractions
	private async automodListOperation(guildID: Snowflake, part: AutoModListPart, operation: AutoModListOperation): Promise<AutoModListOperationResult> {
		const db: AutoModConfiguration = await this.getAutoModConfig(guildID);
		const dbkey: string = (function (part) {
			switch (part) {
				case AutoModPart.word:
					return "wordBlacklist";
				case AutoModPart.token:
					return "wordBlacklistToken";
				case AutoModPart.website:
					return "websiteWhitelist";
				case AutoModPart.invite:
					return "inviteWhitelist";
				case AutoModPart.ignore_channel:
					return "ignoreChannels";
				case AutoModPart.ignore_role:
					return "ignoreRoles";
				case AutoModPart.ignore_user:
					return "ignoreUsers";
				case AutoModPart.avatars:
					return "avatarHashes";
			}
		})(part);
		const result: AutoModListOperationResult = await operation(db[dbkey]);
		await sequelize.query(`UPDATE automods SET "${dbkey}" = $ListContent WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)`, {
			bind: { GuildID: guildID, ListContent: result.list },
			type: QueryTypes.UPDATE,
		});
		return result;
	}

	public async automodAppend(guildID: Snowflake, part: AutoModListPart, items: (string | undefined)[]): Promise<AutoModListOperationResult> {
		return await this.automodListOperation(guildID, part, (dblist: string[]): AutoModListOperationResult => {
			const dbSet: Set<string> = new Set(dblist);
			const itemSet: Set<string | undefined> = new Set(items);
			const duplicateSet: Set<string> = new Set();
			const addedSet: Set<string> = new Set();
			for (const item of itemSet) {
				if (dbSet.has(item!)) duplicateSet.add(item!);
				else dbSet.add(item!), addedSet.add(item!);
			}
			return { list: [...dbSet], added: [...addedSet], removed: [], other: [...duplicateSet] };
		});
	}

	public async automodRemove(guildID: Snowflake, part: AutoModListPart, items: string[]): Promise<AutoModListOperationResult> {
		return await this.automodListOperation(guildID, part, (dblist: string[]): AutoModListOperationResult => {
			const notPresent: string[] = [];
			const removed: string[] = [];
			for (const item of items) {
				if (!dblist.includes(item)) notPresent.push(item);
				else removed.push(item);
			}
			if (items.length === 1) {
				dblist.splice(
					dblist.findIndex(i => i === items[0]),
					1,
				);
			} else {
				dblist.sort((a, b) => +items.includes(b) - +items.includes(a));
				dblist = dblist.slice(dblist.findIndex(i => !items.includes(i)));
			}
			return { list: dblist, added: [], removed: removed, other: notPresent };
		});
	}

	public async automodSetTimeout(guildID: Snowflake, part: AutoModAntiSpamPart, timeout: number): Promise<void> {
		const dbkey: string = (function (part) {
			switch (part) {
				case AutoModPart.message:
					return "timeoutMessages";
				case AutoModPart.mention:
					return "timeoutMentions";
			}
		})(part);

		await sequelize.query(`UPDATE automods SET "${dbkey}" = $Timeout WHERE id = (SELECT id FROM guilds WHERE "guildId" = $GuildID)`, {
			bind: { Timeout: timeout, Part: dbkey, GuildID: guildID },
			type: QueryTypes.UPDATE,
		});
	}

	public async automodSetLimit(guildID: Snowflake, part: AutoModAntiSpamPart, limit: number): Promise<void> {
		const dbkey: string = (function (part) {
			switch (part) {
				case AutoModPart.message:
					return "limitMessages";
				case AutoModPart.mention:
					return "limitMentions";
			}
		})(part);
		await sequelize.query(`UPDATE automods SET "${dbkey}" = $Limit WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)`, {
			bind: { GuildID: guildID, Limit: limit },
			type: QueryTypes.UPDATE,
		});
	}

	public async automodSetPunishment(guildID: Snowflake, part: AutoModPart, punishment: PunishmentType | null): Promise<void> {
		const dbkey: string = (function (part) {
			switch (part) {
				case AutoModPart.message:
					return "punishmentMessages";
				case AutoModPart.mention:
					return "punishmentMentions";
				case AutoModPart.website:
					return "punishmentWebsite";
				case AutoModPart.invite:
					return "punishmentInvites";
				case AutoModPart.word:
					return "punishmentWords";
				case AutoModPart.token:
					return "punishmentWords";
				case AutoModPart.avatars:
					return "punishmentAvatarBans";
				default:
					return "";
			}
		})(part);
		if (!dbkey) return;
		const punishmentkey: string | null = punishment === null ? null : Object.getOwnPropertyNames(PunishmentType).find(n => PunishmentType[n] === punishment) ?? null;
		await sequelize.query(`UPDATE automods SET "${dbkey}" = $Punishment WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)`, {
			bind: { GuildID: guildID, Punishment: punishmentkey },
			type: QueryTypes.UPDATE,
		});
	}

	async getAllBlacklisted(): Promise<Blacklist[]> {
		return await sequelize.query("SELECT * FROM blacklists", { type: QueryTypes.SELECT });
	}

	async infoBlacklist(snowflakeId: Snowflake): Promise<Blacklist> {
		const response: Blacklist[] = await sequelize.query('SELECT * FROM "blacklists" WHERE ("snowflakeId" = $snowflakeId)', {
			bind: { snowflakeId },
			type: QueryTypes.SELECT,
		});
		return response[0];
	}

	async addBlacklist(isGuild: boolean, name: string, snowflakeId: Snowflake, reason: string, developerId: Snowflake): Promise<void> {
		await sequelize.query(
			'INSERT INTO blacklists ("isGuild", name, "snowflakeId", reason, "developerId", "createdAt", "updatedAt") VALUES ($isGuild, $name, $snowflakeId, $reason, $developerId, $createdAt, $updatedAt)',
			{
				bind: {
					isGuild,
					name,
					snowflakeId,
					reason,
					developerId,
					createdAt: moment().format(),
					updatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async removeBlacklist(snowflakeId: Snowflake): Promise<void> {
		await sequelize.query('DELETE FROM "blacklists" WHERE ("snowflakeId" = $snowflakeId)', {
			bind: { snowflakeId },
			type: QueryTypes.DELETE,
		});
	}

	async appendQuickReasons(guildId: Snowflake, reason: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "quickReasons" = array_append("quickReasons", $reason) WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: {
				GuildID: guildId,
				reason,
			},
			type: QueryTypes.UPDATE,
		});
	}

	async removeQuickReason(guildId: Snowflake, reason: string): Promise<void> {
		await sequelize.query('UPDATE "guildConfigurations" SET "quickReasons" = array_remove("quickReasons", $reason) WHERE id = (SELECT "automodId" FROM guilds WHERE "guildId" = $GuildID)', {
			bind: {
				GuildID: guildId,
				reason,
			},
			type: QueryTypes.UPDATE,
		});
	}

	async addToMessageToDB(message: Message) {
		await sequelize.query(
			'INSERT INTO "messageLogs" ("messageId", "channelId", "authorId", "authorTag", "content", "embed", "sticker", "attachments", "createdAt", "updatedAt", "guildId") VALUES ($messageId, $channelId, $authorId, $authorTag, $content, $embed, $sticker, $attachments, $createdAt, $updatedAt, (SELECT id FROM guilds WHERE "guildId" = $guildId))',
			{
				bind: {
					messageId: message.id,
					guildId: message.guild?.id,
					channelId: message.channel.id,
					authorId: message.author.id,
					authorTag: message.author.tag,
					content: message.content,
					embed: message.embeds.length > 0 ? message.embeds[0].toJSON() : null,
					sticker: message.stickers.first() ? message.stickers.first()?.toJSON() : null, // @ts-ignore
					attachments: message.attachments.map((attach: MessageAttachment) => `**${attach.name}**\n${message.channel.nsfw ? `|| ${attach.proxyURL} ||` : attach.proxyURL}`),
					createdAt: moment(message.createdAt).format(),
					updatedAt: moment(message.createdAt).format(),
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async getMessageFromDB(messageId: Snowflake) {
		const response: Record<string, any> = await sequelize.query(
			`
		SELECT * FROM "messageLogs" 
		JOIN guilds ON "messageLogs"."guildId" = guilds.id
		WHERE ("messageId" = $messageId) 
		`,
			{
				bind: { messageId },
				type: QueryTypes.SELECT,
			},
		);
		return response[0];
	}

	async deleteMessageFromDB(messageId: Snowflake) {
		await sequelize.query('DELETE FROM "messageLogs" WHERE ("messageId" = $messageId)', {
			bind: { messageId },
			type: QueryTypes.DELETE,
		});
	}

	async updateMessageContent(messageId: Snowflake, content: string) {
		await sequelize.query('UPDATE "messageLogs" SET "content" = $content WHERE "messageId" = $messageId', {
			bind: { messageId, content },
			type: QueryTypes.UPDATE,
		});
	}

	async getUserArchive(userId: Snowflake, serverId: Snowflake, amount: number) {
		const response: Record<string, any> = await sequelize.query(
			`
			SELECT * FROM "messageLogs"
			WHERE "guildId" = (SELECT id FROM "guilds" WHERE "guildId" = $serverId)
			AND "authorId" = $userId
			LIMIT $amount
		`,
			{
				bind: { serverId, userId, amount },
				type: QueryTypes.SELECT,
			},
		);
		return response;
	}

	async getChannelArchive(channelId: Snowflake, serverId: Snowflake, amount: number) {
		const response: Record<string, any> = await sequelize.query(
			`
			SELECT * FROM "messageLogs"
			WHERE "guildId" = (SELECT id FROM "guilds" WHERE "guildId" = $serverId)
			AND "channelId" = $channelId
			LIMIT $amount
		`,
			{
				bind: { serverId, channelId, amount },
				type: QueryTypes.SELECT,
			},
		);
		return response;
	}

	async getServerArchive(guildId: Snowflake, days: string) {
		const response: Record<string, any> = await sequelize.query(
			`
			SELECT * FROM "messageLogs"
			WHERE "guildId" = (SELECT id FROM "guilds" WHERE "guildId" = $guildId)
			AND "createdAt" < (now() - '${days} days'::interval);
		`,
			{
				bind: { guildId },
				type: QueryTypes.SELECT,
			},
		);
		return response;
	}

	async purgeAllMessagesOlderThan30Days() {
		const deleted: Record<string, any> = await sequelize.query(
			`
			DELETE FROM "messageLogs" 
			WHERE "createdAt" < (now() - '30 days'::interval);
			`,
		);

		return deleted[1].rowCount;
	}

	async purgeMessagesInGuild(guildId: Snowflake, days: string) {
		await sequelize.query(
			`
			DELETE FROM "messageLogs"
			WHERE "guildId" = (SELECT id FROM "guilds" WHERE "guildId" = $guildId)
			AND "createdAt" < (now() - '${days} days'::interval);
			`,
			{
				bind: { guildId },
				type: QueryTypes.DELETE,
			},
		);
	}
}

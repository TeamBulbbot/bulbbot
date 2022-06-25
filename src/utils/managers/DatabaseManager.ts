import * as Config from "../../Config";
import { Message, MessageAttachment, Snowflake } from "discord.js";
import moment from "moment";
import AutoModPart, { AutoModAntiSpamPart, AutoModListPart } from "../types/AutoModPart";
import { AutoModListOperation, AutoModListOperationResult } from "../types/AutoModListOperation";
import PunishmentType from "../types/PunishmentType";
import prisma from "../../prisma";
import { BulbGuild } from "@prisma/client";

interface Identified {
	id: Snowflake;
}

interface Named {
	name: string;
}

type NamedGuild = Identified & Named;

const jsonify = <T = unknown>(val: any): T => JSON.parse(JSON.stringify(val));

export default class DatabaseManager {
	async getGuild(guild: NamedGuild) {
		// if guild is already in db ignore
		const existingGuild = await prisma.bulbGuild.findUnique({
			where: {
				guildId: guild.id,
			},
		});

		if (existingGuild) {
			return existingGuild;
		}

		return await prisma.bulbGuild.create({
			data: {
				name: guild.name,
				guildId: guild.id,
				guildConfiguration: {
					create: {
						prefix: Config.prefix,
					},
				},
				guildLogging: {
					create: {},
				},
				automod: {
					create: {},
				},
			},
		});
	}

	async deleteGuild(guild: NamedGuild) {
		// TODO: Change these to SQL cascading deletes

		const bulbGuild = await this.getGuild(guild);

		return await prisma.$transaction([
			prisma.guildConfiguration.delete({
				where: {
					id: bulbGuild.guildConfigurationId,
				},
			}),
			prisma.automod.delete({
				where: {
					id: bulbGuild.automodId,
				},
			}),
			prisma.guildLogging.delete({
				where: {
					id: bulbGuild.guildLoggingId,
				},
			}),
			prisma.infraction.deleteMany({
				where: {
					bulbGuildId: bulbGuild.id,
				},
			}),
			prisma.messageLog.deleteMany({
				where: {
					bulbGuildId: bulbGuild.id,
				},
			}),
			prisma.banpool.deleteMany({
				where: {
					bulbGuildId: bulbGuild.id,
				},
			}),
			prisma.tempban.deleteMany({
				where: {
					bulbGuildId: bulbGuild.id,
				},
			}),
			prisma.bulbGuild.delete({
				where: {
					id: bulbGuild.id,
				},
			}),
		]);
	}

	async getConfig(guild: NamedGuild) {
		const entry = await this.getGuild(guild);

		const config = await prisma.guildConfiguration.findUnique({
			where: {
				id: entry.guildConfigurationId,
			},
		});

		if (!config) {
			throw new Error(`config ID is missing from new bulbGuild, ${entry.id}`);
		}
		return config;
	}

	async getAutoModConfig(guild: NamedGuild) {
		const entry = await this.getGuild(guild);

		const config = await prisma.automod.findUnique({
			where: {
				id: entry.automodId,
			},
		});

		if (!config) {
			throw new Error(`automod ID is missing from new bulbGuild, ${entry.id}`);
		}
		return config;
	}

	async getCombinedLoggingConfig(guild: Identified) {
		const result = await prisma.bulbGuild.findUnique({
			where: {
				guildId: guild.id,
			},
			select: {
				guildId: true,
				guildLogging: true,
				guildConfiguration: {
					select: {
						timezone: true,
					},
				},
			},
		});
		if (!result?.guildLogging || !result.guildConfiguration) {
			throw new Error("could not find guild for logging config");
		}
		const { timezone, guildId, ...guildLogging } = {
			guildId: result.guildId,
			...result.guildLogging,
			...result.guildConfiguration,
		};
		return { timezone, guildId, guildLogging };
	}

	async getFullGuildConfig(guild: Identified) {
		return await prisma.bulbGuild.findUnique({
			where: { guildId: guild.id },
			include: {
				guildConfiguration: true,
				guildLogging: true,
				automod: true,
				infractions: true,
				tempbans: true,
				banpools: true,
			},
		});
	}

	// TODO: Fix the schema so we don't have to get the bulbGuild every time we do anything
	public async updateConfig<
		T extends "bulbGuild" | "guildLogging" | "guildConfiguration" | "automod",
		K extends keyof Parameters<typeof prisma[T]["update"]>[0]["data"],
		V extends Parameters<typeof prisma[T]["update"]>[0]["data"][K],
	>({ guild, table, field, value }: { guild: NamedGuild; table: T; field: K; value: V }) {
		const db = await this.getGuild(guild);
		// @ts-expect-error TS is a bit scared of this, it's fine I think
		const result = await prisma[table].update({
			data: {
				[field]: value,
			},
			where: {
				id: db[`${table}Id` as keyof BulbGuild],
			},
		});
		return result;
	}

	// Append/Remove Abstractions
	private async automodListOperation(guild: NamedGuild, part: AutoModListPart, operation: AutoModListOperation): Promise<AutoModListOperationResult> {
		const db = await this.getAutoModConfig(guild);
		const dbkey = (function (part) {
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
		await prisma.automod.update({
			data: {
				[dbkey]: result.list,
			},
			where: {
				id: db.id,
			},
		});
		return result;
	}

	public async automodAppend(guild: NamedGuild, part: AutoModListPart, items: (string | undefined)[]): Promise<AutoModListOperationResult> {
		return await this.automodListOperation(guild, part, (dblist: string[]): AutoModListOperationResult => {
			const dbSet: Set<string> = new Set(dblist);
			const itemSet: Set<string | undefined> = new Set(items);
			const duplicateSet: Set<string> = new Set();
			const addedSet: Set<string> = new Set();
			for (const item of itemSet) {
				if (item === undefined) continue;
				if (dbSet.has(item)) duplicateSet.add(item);
				else dbSet.add(item), addedSet.add(item);
			}
			return { list: [...dbSet], added: [...addedSet], removed: [], other: [...duplicateSet] };
		});
	}

	public async automodRemove(guild: NamedGuild, part: AutoModListPart, items: string[]): Promise<AutoModListOperationResult> {
		return await this.automodListOperation(guild, part, (dblist: string[]): AutoModListOperationResult => {
			const notPresent: string[] = [];
			const removed: string[] = [];
			for (const item of items) {
				if (!dblist.includes(item)) notPresent.push(item);
				else removed.push(item);
			}
			if (items.length === 1) {
				dblist.splice(
					dblist.findIndex((i) => i === items[0]),
					1,
				);
			} else {
				dblist.sort((a, b) => +items.includes(b) - +items.includes(a));
				dblist = dblist.slice(dblist.findIndex((i) => !items.includes(i)));
			}
			return { list: dblist, added: [], removed: removed, other: notPresent };
		});
	}

	public async automodSetTimeout(guild: NamedGuild, part: AutoModAntiSpamPart, timeout: number) {
		const dbkey = (function (part) {
			switch (part) {
				case AutoModPart.message:
					return "timeoutMessages";
				case AutoModPart.mention:
					return "timeoutMentions";
			}
		})(part);

		const db = await this.getAutoModConfig(guild);
		return await prisma.automod.update({
			data: {
				[dbkey]: timeout,
			},
			where: {
				id: db.id,
			},
		});
	}

	public async automodSetLimit(guild: NamedGuild, part: AutoModAntiSpamPart, limit: number) {
		const dbkey = (function (part) {
			switch (part) {
				case AutoModPart.message:
					return "limitMessages";
				case AutoModPart.mention:
					return "limitMentions";
			}
		})(part);
		const db = await this.getAutoModConfig(guild);
		return await prisma.automod.update({
			data: {
				[dbkey]: limit,
			},
			where: {
				id: db.id,
			},
		});
	}

	public async automodSetPunishment(guild: NamedGuild, part: AutoModPart, punishment: PunishmentType | null) {
		const dbPunishmentKeys = {
			[AutoModPart.message]: "punishmentMessages",
			[AutoModPart.mention]: "punishmentMentions",
			[AutoModPart.website]: "punishmentWebsite",
			[AutoModPart.invite]: "punishmentInvites",
			[AutoModPart.word]: "punishmentWords",
			[AutoModPart.token]: "punishmentWords",
			[AutoModPart.avatars]: "punishmentAvatarBans",
		} as const;

		const dbkey = dbPunishmentKeys[part as keyof typeof dbPunishmentKeys];

		if (!dbkey) return;
		const punishmentkey: keyof typeof PunishmentType | null = punishment !== null ? (PunishmentType[punishment] as keyof typeof PunishmentType) ?? null : null;

		const db = await this.getAutoModConfig(guild);
		return await prisma.automod.update({
			data: {
				[dbkey]: punishmentkey,
			},
			where: {
				id: db.id,
			},
		});
	}

	async infoBlacklist(snowflakeId: Snowflake) {
		// TODO: Figure out if snowflakeId is unique
		return await prisma.blacklistEntry.findFirst({
			where: {
				snowflakeId,
			},
		});
	}

	async addBlacklist(isGuild: boolean, name: string, snowflakeId: Snowflake, reason: string, developerId: Snowflake) {
		return await prisma.blacklistEntry.create({
			data: {
				isGuild,
				name,
				snowflakeId,
				reason,
				developerId,
			},
		});
	}

	async removeBlacklist(snowflakeId: Snowflake) {
		// TODO: Figure out if snowflakeId is unique
		return await prisma.blacklistEntry.deleteMany({
			where: {
				snowflakeId,
			},
		});
	}

	async appendQuickReasons(guild: NamedGuild, reason: string) {
		const db = await this.getConfig(guild);
		return await prisma.guildConfiguration.update({
			data: {
				quickReasons: [...db.quickReasons, reason],
			},
			where: {
				id: db.id,
			},
		});
	}

	async removeQuickReason(guild: NamedGuild, reason: string) {
		const db = await this.getConfig(guild);
		return await prisma.guildConfiguration.update({
			data: {
				quickReasons: db.quickReasons.filter((quickReason) => quickReason !== reason),
			},
			where: {
				id: db.id,
			},
		});
	}

	async addToMessageToDB(message: Message) {
		if (!message.guild) {
			throw new Error("message does not have a guild, cannot add to logs");
		}

		await prisma.messageLog.create({
			data: {
				messageId: message.id,
				bulbGuild: {
					connect: {
						guildId: message.guild.id,
					},
				},
				channelId: message.channel.id,
				authorId: message.author.id,
				authorTag: message.author.tag,
				content: message.content,
				embed: message.embeds.length > 0 ? jsonify(message.embeds[0].toJSON()) : undefined,
				sticker: message.stickers.first() ? jsonify(message.stickers.first()?.toJSON()) : undefined,
				// @ts-expect-error It thinks it could be a DM channel and therefore accessing nsfw boolean is bad but it's fine here
				attachments: message.attachments.map((attach: MessageAttachment) => `**${attach.name}**\n${message.channel.nsfw ? `|| ${attach.proxyURL} ||` : attach.proxyURL}`),
				createdAt: moment(message.createdAt).format(),
				updatedAt: moment(message.createdAt).format(),
			},
		});
	}

	async getUserArchive(authorId: Snowflake, guild: NamedGuild, amount: number | undefined) {
		return await prisma.messageLog.findMany({
			where: {
				authorId,
				bulbGuild: {
					guildId: guild.id,
				},
			},
			take: amount,
		});
	}

	async getChannelArchive(channelId: Snowflake, guild: NamedGuild, amount: number | undefined) {
		return await prisma.messageLog.findMany({
			where: {
				channelId,
				bulbGuild: {
					guildId: guild.id,
				},
			},
			take: amount,
		});
	}

	async getServerArchive(guild: NamedGuild, days: number) {
		const now = Date.now();
		const daysInMs = days * 24 * 60 * 60 * 1000;
		const daysAgo = new Date(now - daysInMs);
		const db = await this.getGuild(guild);
		return await prisma.messageLog.findMany({
			where: {
				bulbGuildId: db.id,
				createdAt: {
					lte: daysAgo,
				},
			},
		});
	}

	async purgeAllMessagesOlderThan30Days() {
		const now = Date.now();
		const thirtyDays = 30 * 24 * 60 * 60 * 1000;
		const thirtyDaysAgo = new Date(now - thirtyDays);
		const result = await prisma.messageLog.deleteMany({
			where: {
				createdAt: {
					lte: thirtyDaysAgo,
				},
			},
		});
		return result.count;
	}

	async purgeMessagesInGuild(guild: NamedGuild, days: number) {
		const now = Date.now();
		const daysInMs = days * 24 * 60 * 60 * 1000;
		const daysAgo = new Date(now - daysInMs);
		const db = await this.getGuild(guild);
		const result = await prisma.messageLog.deleteMany({
			where: {
				bulbGuildId: db.id,
				createdAt: {
					lte: daysAgo,
				},
			},
		});
		return result.count;
	}
}

export const databaseManager = new DatabaseManager();

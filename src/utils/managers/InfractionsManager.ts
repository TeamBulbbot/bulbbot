import { Guild, GuildMember, Snowflake, User } from "discord.js";
import moment, { MomentInput } from "moment";
import BulbBotClient from "../../structures/BulbBotClient";
import LoggingManager from "./LoggingManager";
import { BanType } from "../types/BanType";
import { MuteType } from "../types/MuteType";
import prisma from "../../prisma";
import { isNullish, paginate } from "../helpers";

const loggingManager: LoggingManager = new LoggingManager();

type GetInfractionsParams = { guildId: Snowflake; targetId: Snowflake };

export default class InfractionsManager {
	async createInfraction(guildId: Snowflake, action: string, active: boolean | number, reason: string, target: User, moderator: User) {
		return await prisma.infraction.create({
			data: {
				action,
				active: `${active}`,
				reason,
				target: target.tag,
				targetId: target.id,
				moderator: moderator.tag,
				moderatorId: moderator.id,
				bulbGuild: {
					connect: {
						guildId,
					},
				},
			},
		});
	}

	public async deleteInfraction(guildId: Snowflake, infractionId: number) {
		// Verify infraction is for this guild
		const infraction = this.getInfraction(guildId, infractionId);
		if (!infraction) {
			return null;
		}
		return await prisma.infraction.delete({
			where: {
				id: infractionId,
			},
		});
	}

	public async getInfraction(guildId: Snowflake, infractionId: number) {
		return await prisma.infraction.findFirst({
			where: {
				id: infractionId,
				bulbGuild: {
					guildId,
				},
			},
		});
	}

	public async getOffenderInfractions({ guildId, targetId, ...args }: GetInfractionsParams & Paginatetable) {
		return await prisma.infraction.findMany({
			where: {
				targetId,
				bulbGuild: {
					guildId,
				},
			},
			...paginate(args),
		});
	}

	public async getModeratorInfractions({ guildId, targetId, ...args }: GetInfractionsParams & Paginatetable) {
		return await prisma.infraction.findMany({
			where: {
				moderatorId: targetId,
				bulbGuild: {
					guildId,
				},
			},
			...paginate(args),
		});
	}

	public async getAllUserInfractions({ guildId, targetId, ...args }: GetInfractionsParams & Paginatetable) {
		return await prisma.infraction.findMany({
			where: {
				OR: [
					{
						targetId,
					},
					{
						moderatorId: targetId,
					},
				],
				// This is implicitly AND
				bulbGuild: {
					guildId,
				},
			},
			...paginate(args),
		});
	}

	public async isActive(guildId: Snowflake, infractionId: Maybe<number>) {
		if (typeof infractionId !== "number") return false;

		const result = await prisma.infraction.findFirst({
			select: {
				active: true,
			},
			where: {
				id: infractionId,
				bulbGuild: {
					guildId,
				},
			},
		});

		if (isNullish(result)) {
			return false;
		}

		// FIXME: What is this? Is this a boolean? If so, isn't there a DB data type for that? Might be something like tinyint
		return JSON.parse(result.active);
	}

	public async setActive(guildId: Snowflake, infractionId: Maybe<number>, active: boolean | number) {
		if (typeof infractionId !== "number") return;

		// We check to ensure this infraction belongs to this guild
		const infraction = await this.getInfraction(guildId, infractionId);
		if (isNullish(infraction)) {
			return;
		}

		return await prisma.infraction.update({
			data: {
				active: `${active}`,
			},
			where: {
				id: infractionId,
			},
		});
	}

	public async updateModerator(guildId: Snowflake, infractionId: number, moderator: User) {
		if (isNullish(await this.getInfraction(guildId, infractionId))) {
			return;
		}
		return await prisma.infraction.update({
			data: {
				moderator: moderator.tag,
				moderatorId: moderator.id,
			},
			where: {
				id: infractionId,
			},
		});
	}

	public async updateReason(guildId: Snowflake, infractionId: number, reason: string) {
		if (isNullish(await this.getInfraction(guildId, infractionId))) {
			return;
		}
		return await prisma.infraction.update({
			data: {
				reason,
			},
			where: {
				id: infractionId,
			},
		});
	}

	public async getLatestMute(guildId: Snowflake, targetId: Snowflake) {
		return await prisma.infraction.findFirst({
			where: {
				targetId,
				action: "Mute",
				active: {
					not: "false",
				},
				bulbGuild: {
					guildId,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async getLatestInfraction(guildId: Snowflake, moderatorId: Snowflake, targetId: Snowflake, action: string) {
		return await prisma.infraction.findFirst({
			where: {
				targetId,
				moderatorId,
				action,
				bulbGuild: {
					guildId,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	public async warn(client: BulbBotClient, guild: Guild, target: User, moderator: GuildMember, reasonLog: string, reason: string) {
		const { id: infID } = await this.createInfraction(guild.id, "Warn", true, reason, target, moderator.user);
		await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.warn", guild.id, {}), target, moderator.user, reason, infID);

		return infID;
	}

	public async kick(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string) {
		if (!target.kickable) return null;
		const { id: infID } = await this.createInfraction(guild.id, "Kick", true, reason, target.user, moderator.user);
		await target.kick(reasonLog);
		await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.kick", guild.id, {}), target.user, moderator.user, reason, infID);

		return infID;
	}

	public async ban(client: BulbBotClient, guild: Guild, type: BanType, target: User, moderator: GuildMember, reasonLog: string, reason: string) {
		if (type == BanType.FORCE) {
			const { id: infID } = await this.createInfraction(guild.id, "Force-ban", true, reason, target, moderator.user);
			await guild.members.ban(target, { reason: reasonLog });
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.force_ban", guild.id, {}), target, moderator.user, reason, infID);

			return infID;
		} else if (type == BanType.CLEAN) {
			const { id: infID } = await this.createInfraction(guild.id, "Ban", true, reason, target, moderator.user);
			await guild.members.ban(target.id, { reason: reasonLog, days: 7 });
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.ban", guild.id, {}), target, moderator.user, reason, infID);

			return infID;
		} else if (type == BanType.SOFT) {
			const { id: infID } = await this.createInfraction(guild.id, "Soft-ban", true, reason, target, moderator.user);
			await guild.members.ban(target.id, { reason: reasonLog, days: 7 });
			await guild.members.unban(target.id);
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.soft_ban", guild.id, {}), target, moderator.user, reason, infID);

			return infID;
		} else if (type == BanType.POOL) {
			const { id: infID } = await this.createInfraction(guild.id, "Pool-ban", true, reason, target, moderator.user);
			await guild.members.ban(target, { reason: reasonLog });
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.pool_ban", guild.id, {}), target, moderator.user, reason, infID);

			return infID;
		} else {
			const { id: infID } = await this.createInfraction(guild.id, "Ban", true, reason, target, moderator.user);
			await guild.members.cache.get(target.id)?.ban({ reason: reasonLog });
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.ban", guild.id, {}), target, moderator.user, reason, infID);

			return infID;
		}
	}

	public async tempban(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string, until: MomentInput) {
		if (!target.bannable || (typeof until !== "number" && typeof until !== "boolean")) return null;
		await target.ban({ reason: reasonLog });
		const { id: infID } = await this.createInfraction(guild.id, "Tempban", until, reason, target.user, moderator.user);
		await loggingManager.sendModActionTemp(client, guild, await client.bulbutils.translate("mod_action_types.temp_ban", guild.id, {}), target.user, moderator.user, reason, infID, until);

		return infID;
	}

	public async mute(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string, until: MomentInput) {
		await target.timeout(moment(until).diff(moment(), "milliseconds"), reason);
		const { id: infID } = await this.createInfraction(guild.id, "Mute", true, reason, target.user, moderator.user);
		await loggingManager.sendModActionTemp(client, guild, await client.bulbutils.translate("mod_action_types.mute", guild.id, {}), target.user, moderator.user, reason, infID, until);

		return infID;
	}

	public async unmute(client: BulbBotClient, guild: Guild, type: MuteType, target: GuildMember, moderator: User, reasonLog: string, reason: string) {
		await target.timeout(null, reason);
		const { id: infID } = await this.createInfraction(guild.id, "Unmute", true, reason, target.user, moderator);
		await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.unmute", guild.id, {}), target.user, moderator, reason, infID);

		return infID;
	}

	public async unban(client: BulbBotClient, guild: Guild, type: BanType, target: User, moderator: GuildMember, reasonLog: string, reason: string) {
		await guild.members.unban(target, reasonLog);
		const { id: infID } = await this.createInfraction(guild.id, "Unban", true, reason, target, moderator.user);

		if (type === BanType.MANUAL) {
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.unban", guild.id, {}), target, moderator.user, reason, infID);
		} else if (type === BanType.TEMP) {
			await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.auto_unban", guild.id, {}), target, moderator.user, reason, infID);
		}

		return infID;
	}

	public async deafen(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string) {
		await target.voice.setDeaf(true, reason);
		const { id: infID } = await this.createInfraction(guild.id, "Deafen", true, reason, target.user, moderator.user);
		await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.deafen", guild.id, {}), target.user, moderator.user, reason, infID);

		return infID;
	}

	public async undeafen(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string) {
		await target.voice.setDeaf(false, reason);
		const { id: infID } = await this.createInfraction(guild.id, "Undeafen", true, reason, target.user, moderator.user);
		await loggingManager.sendModAction(client, guild, await client.bulbutils.translate("mod_action_types.undeafen", guild.id, {}), target.user, moderator.user, reason, infID);

		return infID;
	}

	public async nickname(client: BulbBotClient, guild: Guild, target: GuildMember, moderator: GuildMember, reasonLog: string, reason: string, nickOld: string, nickNew: string) {
		await target.setNickname(nickNew, reason);
		const { id: infID } = await this.createInfraction(guild.id, "Nickname", true, reason, target.user, moderator.user);
		await loggingManager.sendModActionPreformatted(
			client,
			guild,
			await client.bulbutils.translate(nickNew ? "nickname_mod_log" : "nickname_remove_mod_log", guild.id, {
				action: await client.bulbutils.translate(nickNew ? "mod_action_types.nick_change" : "mod_action_types.nick_remove", guild.id, { client: client }),
				target: target.user,
				nick_old: nickOld,
				nick_new: nickNew,
				moderator: moderator.user,
				reason: reason,
				infraction_id: infID,
			}),
		);

		return infID;
	}
}

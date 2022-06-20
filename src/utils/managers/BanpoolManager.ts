import { Snowflake } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import prisma from "../../prisma";
import { BanpoolInvite } from "../types/BanpoolInvite";

export default class {
	async createBanpool(guildId: Snowflake, poolName: string) {
		return await prisma.banpool.create({
			data: {
				name: poolName,
				bulbGuild: {
					connect: {
						guildId,
					},
				},
			},
		});
	}

	async hasBanpoolLog(guildId: Snowflake): Promise<boolean> {
		const { banpool } =
			(await prisma.guildLogging.findFirst({
				where: {
					bulbGuilds: {
						guildId,
					},
				},
			})) || {};

		return !!banpool;
	}

	async doesBanpoolExist(name: string): Promise<boolean> {
		const banpool = await prisma.banpool.findFirst({
			select: {
				id: true,
			},
			where: {
				name,
			},
		});

		return !!banpool;
	}

	async haveAccessToPool(guildId: Snowflake, poolName: string): Promise<boolean> {
		const access = await prisma.banpool.findFirst({
			where: {
				name: poolName,
				bulbGuild: {
					guildId,
				},
			},
		});

		return !!access;
	}

	async joinBanpool(invite: { banpool: Pick<Pick<BanpoolInvite, "banpool">["banpool"], "name"> }, guildId: Snowflake) {
		return await prisma.banpoolSubscriber.create({
			data: {
				guildId,
				banpool: {
					connect: {
						name: invite.banpool.name,
					},
				},
			},
		});
	}

	async getPools(guildId: Snowflake) {
		return await prisma.banpool.findMany({
			where: {
				bulbGuild: {
					guildId,
				},
			},
		});
	}

	async getGuildIdsFromPools(pools: number[]) {
		return [
			// Dedupe strings
			...new Set(
				// Unpack
				Array.from(
					// Query database
					await prisma.banpoolSubscriber.findMany({
						select: {
							guildId: true,
						},
						where: {
							banpoolId: {
								in: pools,
							},
						},
					}),
					({ guildId }) => guildId,
				),
			),
		];
	}

	async getPoolData(poolname: string) {
		return await prisma.banpool.findUnique({
			where: {
				name: poolname,
			},
			include: {
				banpoolSubscribers: true,
			},
		});
	}

	async isGuildInPool(guildId: Snowflake, poolname: string) {
		const guildsArray: string[] = [];
		const guilds: any = await sequelize.query('SELECT "guildId" FROM "banpoolSubscribers" WHERE "banpoolId" = (SELECT id FROM banpools WHERE "name" = $PoolName)', {
			bind: {
				PoolName: poolname,
			},
			type: QueryTypes.SELECT,
		});

		for (let ii = 0; ii < guilds.length; ii++) guildsArray.push(guilds[ii].guildId);

		return guildsArray.includes(guildId);
	}

	async leavePool(guildId: Snowflake, poolname: string) {
		await sequelize.query('DELETE FROM "banpoolSubscribers" WHERE "guildId" = $GuildID AND "banpoolId" = (SELECT id FROM banpools WHERE name = $PoolName)', {
			bind: { GuildID: guildId, PoolName: poolname },
			type: QueryTypes.DELETE,
		});
	}

	async getCreatorGuild(poolname: string) {
		const guid: any = await sequelize.query('SELECT "guildId" from guilds WHERE id = (SELECT "guildId" from banpools WHERE name = $PoolName)', {
			bind: {
				PoolName: poolname,
			},
			type: QueryTypes.SELECT,
		});

		return guid[0].guildId;
	}

	async deletePool(poolname: string) {
		await sequelize.query('DELETE FROM "banpoolSubscribers" WHERE "banpoolId" = (SELECT id FROM banpools WHERE name = $PoolName)', {
			bind: { PoolName: poolname },
			type: QueryTypes.DELETE,
		});

		await sequelize.query("DELETE FROM banpools WHERE name = $PoolName", {
			bind: { PoolName: poolname },
			type: QueryTypes.DELETE,
		});
	}
}

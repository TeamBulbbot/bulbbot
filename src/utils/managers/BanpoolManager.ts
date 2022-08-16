import { Snowflake } from "discord.js";
import prisma from "../../prisma";
import { BanpoolInvite } from "../types/BanpoolInvite";
import { isNullish } from "../helpers";

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
					bulbGuild: {
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

	async getPool(name: string) {
		return await prisma.banpool.findUnique({
			where: {
				name,
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
		const subscriber = await prisma.banpoolSubscriber.findFirst({
			where: {
				guildId,
				banpool: {
					name: poolname,
				},
			},
		});

		return !!subscriber;
	}

	async leavePool(guildId: Snowflake, poolname: string) {
		const pool = await this.getPool(poolname);
		if (isNullish(pool)) {
			return;
		}
		const { id: banpoolId } = pool;
		return await prisma.banpoolSubscriber.delete({
			where: {
				guildId_banpoolId: {
					guildId,
					banpoolId,
				},
			},
		});
	}

	async getCreatorGuild(name: string) {
		const bulbGuild = await prisma.banpool
			.findUnique({
				where: {
					name,
				},
			})
			.bulbGuild({
				select: {
					guildId: true,
				},
			});

		if (isNullish(bulbGuild)) {
			throw new Error("could not resolve banpool creator guild");
		}

		return bulbGuild.guildId;
	}

	async deletePool(name: string) {
		return await prisma.banpool.delete({
			where: {
				name,
			},
		});
	}
}

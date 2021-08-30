import { Snowflake } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	async createBanpool(guildId: Snowflake, poolName: string): Promise<void> {
		await sequelize.query('INSERT INTO "banpools" (name, "createdAt", "updatedAt", "guildId") VALUES ($PoolName, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildId))', {
			bind: {
				PoolName: poolName,
				CreatedAt: moment().format(),
				UpdatedAt: moment().format(),
				GuildId: guildId,
			},
			type: QueryTypes.INSERT,
		});
	}

	async doesbanpoolExist(name: string): Promise<boolean> {
		const doesExist: any = await sequelize.query('SELECT id FROM "banpools" WHERE name = $PoolName LIMIT 1', {
			bind: {
				PoolName: name,
			},
			type: QueryTypes.SELECT,
		});

		return !!doesExist[0];
	}

	async haveAccessToPool(guildId: Snowflake, poolName: string): Promise<boolean> {
		const access: any = await sequelize.query('SELECT id FROM "banpools" WHERE name = $PoolName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildId) LIMIT 1', {
			bind: {
				PoolName: poolName,
				GuildId: guildId,
			},
			type: QueryTypes.SELECT,
		});

		return !access[0];
	}


	async joinBanpool(invite: any, guildId: Snowflake): Promise<boolean> {
		await sequelize.query('INSERT INTO "banpoolSubscribers" ("guildId", "createdAt", "updatedAt", "banpoolId") VALUES ($GuildId, $CreatedAt, $UpdatedAt, (SELECT id FROM banpools WHERE "name" = $Name))', {
			bind: {
				GuildId: guildId,
				CreatedAt: moment().format(),
				UpdatedAt: moment().format(),
				Name: invite.banpool.name,
			},
			type: QueryTypes.INSERT,
		}).catch((err: Error) => console.error(err))

		return true
	}

	async getPools(guildId: Snowflake): Promise<any> {
		const poolIds: any = await sequelize.query('SELECT "banpoolId" FROM "banpoolSubscribers" WHERE "guildId" = $GuildId',
			{
				bind: {
					GuildId: guildId
				},
				type: QueryTypes.SELECT
			}
		)

		let pools: any[] = [];
		for (let i = 0; i < poolIds.length; i++) {
			const pool = await sequelize.query('SELECT * FROM "banpools" WHERE id = $PoolId',
				{
					bind: {
						PoolId: poolIds[i].banpoolId
					},
					type: QueryTypes.SELECT
				})


			if (!pools.includes(pool[0])) pools.push(pool[0])

		}

		return pools

	}
}

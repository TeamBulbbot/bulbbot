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
}

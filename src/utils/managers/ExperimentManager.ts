import { Snowflake } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	async addExperimentToGuild(guildId: Snowflake, name: string): Promise<void> {
		const response: any = await sequelize.query(
			'INSERT INTO experiments ("name", "createdAt", "updatedAt", "guildId") VALUES ($name, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $guildId)) RETURNING *;',
			{
				bind: {
					guildId,
					name,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);

		return response[0][0];
	}

	public async removeExperimentFromGuild(guildId: Snowflake, name: string): Promise<void> {
		await sequelize.query('DELETE FROM experiments WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $guildId) AND name = $name', {
			bind: { guildId, name },
			type: QueryTypes.DELETE,
		});
	}

	public async getAllGuildExperiments(guildId: Snowflake): Promise<any> {
		const response: any = await sequelize.query('SELECT name FROM experiments WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $guildId)', {
			bind: { guildId },
			type: QueryTypes.SELECT,
		});

		return response.map((e: { name: any }) => e.name);
	}
}

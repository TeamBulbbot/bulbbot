import { sequelize } from "../database/connection";
import { Snowflake, GuildMember } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	public async createTempBan(target: GuildMember, reason: string, expireTime: number, guildId: Snowflake): Promise<void> {
		await sequelize.query(
			'INSERT INTO tempbans ("targetTag", "targetId", "gId", reason, "expireTime", "createdAt", "updatedAt", "guildId") VALUES ($TargetTag, $TargetId, $GID, $Reason, $ExpireTime, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildId))',
			{
				bind: {
					Reason: reason,
					TargetTag: target.user.tag,
					TargetId: target.user.id,
					ExpireTime: expireTime,
					GID: guildId,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
					GuildId: guildId,
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	public async getTempBan(id: number): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM tempbans WHERE "id" = $Id', {
			bind: { Id: id },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	public async getLatestTempBan(target: GuildMember, guildId: Snowflake): Promise<any> {
		const response: Record<string, any> = await sequelize.query(
			'SELECT * FROM tempbans WHERE "targetId" = $TargetId AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildId) ORDER BY id DESC LIMIT 1',
			{
				bind: {
					TargetId: target.user.id,
					GuildId: guildId,
				},
				type: QueryTypes.SELECT,
			},
		);

		return response[0];
	}

	public async deleteTempBan(id: number): Promise<void> {
		await sequelize.query('DELETE FROM tempbans WHERE "id" = $Id', {
			bind: {
				Id: id,
			},
			type: QueryTypes.DELETE,
		});
	}

	public async getAllTemBans(): Promise<any> {
		const mutes: Record<string, any> = await sequelize.query("SELECT * FROM tempbans", {
			type: QueryTypes.SELECT,
		});

		return mutes;
	}
}

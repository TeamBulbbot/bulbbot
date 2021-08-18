import { sequelize } from "../database/connection";
import { Snowflake, GuildMember } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	public async createMute(target: GuildMember, reason: string, expireTime: number, guildId: Snowflake): Promise<void> {
		await sequelize.query(
			'INSERT INTO tempmutes ("targetTag", "targetId", "gId", reason, "expireTime", "createdAt", "updatedAt", "guildId") VALUES ($TargetTag, $TargetId, $GID, $Reason, $ExpireTime, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildId))',
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

	public async getMute(id: number): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM tempmutes WHERE "id" = $Id', {
			bind: { Id: id },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	public async getLatestMute(target: GuildMember, guildId: Snowflake): Promise<any> {
		const response: Record<string, any> = await sequelize.query(
			'SELECT * FROM tempmutes WHERE "targetId" = $TargetId AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildId) ORDER BY id DESC LIMIT 1',
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

	public async deleteMute(id: number): Promise<void> {
		await sequelize.query('DELETE FROM tempmutes WHERE "id" = $Id', {
			bind: {
				Id: id,
			},
			type: QueryTypes.DELETE,
		});
	}

	public async getAllMutes(): Promise<any> {
		const mutes: Record<string, any> = await sequelize.query("SELECT * FROM tempmutes", {
			type: QueryTypes.SELECT,
		});

		return mutes;
	}
}

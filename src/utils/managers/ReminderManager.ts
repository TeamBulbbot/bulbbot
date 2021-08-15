import { sequelize } from "../database/connection";
import { Snowflake } from "discord.js";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	public async createReminder(reason: string, expireTime: number, userId: Snowflake, channelId: Snowflake, messageId: Snowflake): Promise<void> {
		sequelize.query(
			'INSERT INTO reminds (reason, "expireTime", "userId", "channelId", "messageId", "createdAt", "updatedAt" ) VALUES ($Reason, $ExpireTime, $UserId, $ChannelId, $MessageId, $CreatedAt, $UpdatedAt)',
			{
				bind: {
					Reason: reason,
					ExpireTime: expireTime,
					UserId: userId,
					ChannelId: channelId,
					MessageId: messageId,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	public async getLatestReminder(userId: Snowflake): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "userId" = $UserId  ORDER BY id DESC LIMIT 1', {
			bind: {
				UserId: userId,
			},
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	public async getReminder(id: number): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "id" = $Id', {
			bind: { Id: id },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	public async deleteUserReminder(id: number, userId: Snowflake): Promise<boolean> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "id" = $Id AND "userId" = $UserId', {
			bind: { Id: id, UserId: userId },
			type: QueryTypes.SELECT,
		});

		// somewhere here with some validation idk too tired to think

		await sequelize.query('DELETE FROM reminds WHERE "id" = $Id AND "userId" = $UserId', {
			bind: {
				Id: id,
				UserId: userId,
			},
			type: QueryTypes.DELETE,
		});

		return true;
	}

	public async deleteReminder(id: number): Promise<void> {
		await sequelize.query('DELETE FROM reminds WHERE "id" = $Id', {
			bind: {
				Id: id,
			},
			type: QueryTypes.DELETE,
		});
	}
	public async listReminders(userId: Snowflake): Promise<any> {
		const response: Record<string, any> = await sequelize.query('SELECT * FROM reminds WHERE "userId" = $UserId LIMIT 10', {
			bind: {
				UserId: userId,
			},
			type: QueryTypes.SELECT,
		});

		return response;
	}
}

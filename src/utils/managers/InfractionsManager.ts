import { Snowflake, User } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	async createInfraction(
		guildID: Snowflake,
		action: string,
		active: boolean | number,
		reason: string,
		target: string,
		targetID: Snowflake,
		moderator: string,
		moderatorID: Snowflake,
	): Promise<void> {
		await sequelize.query(
			'INSERT INTO infractions (action, active, reason, target, "targetId", moderator, "moderatorId", "createdAt", "updatedAt", "guildId") VALUES ($InfAction, $Active, $Reason, $Target, $TargetID, $Moderator, $ModeratorID, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildID))',
			{
				bind: {
					GuildID: guildID,
					InfAction: action,
					Active: active,
					Reason: reason,
					Target: target,
					TargetID: targetID,
					Moderator: moderator,
					ModeratorID: moderatorID,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async deleteInfraction(guildID: Snowflake, infractionID: number): Promise<void> {
		await sequelize.query('DELETE FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfID', {
			bind: { GuildID: guildID, InfID: infractionID },
			type: QueryTypes.DELETE,
		});
	}

	async getInfraction(guildID: Snowflake, infractionID: number): Promise<object | undefined> {
		const response: object = await sequelize.query(
			'SELECT * FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfID',
			{
				bind: { GuildID: guildID, InfID: infractionID },
				type: QueryTypes.SELECT,
			},
		);

		return response[0];
	}

	async getAllInfractions(guildID: Snowflake): Promise<object[] | undefined> {
		return await sequelize.query('SELECT * FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) LIMIT 50', {
			bind: { GuildID: guildID },
			type: QueryTypes.SELECT,
		});
	}

	async getOffenderInfractions(guildID: Snowflake, targetID: Snowflake): Promise<object[] | undefined> {
		return await sequelize.query(
			'SELECT * FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND "targetId" = $TargetID LIMIT 50',
			{
				bind: { GuildID: guildID, TargetID: targetID },
				type: QueryTypes.SELECT,
			},
		);
	}

	async getModeratorInfractions(guildID: Snowflake, targetID: Snowflake): Promise<object[] | undefined> {
		return await sequelize.query(
			'SELECT * FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND "moderatorId" = $ModeratorID LIMIT 50',
			{
				bind: { GuildID: guildID, ModeratorID: targetID },
				type: QueryTypes.SELECT,
			},
		);
	}

	async getAllUserInfractions(guildID: Snowflake, targetID: Snowflake): Promise<object[] | undefined> {
		return await sequelize.query(
			'SELECT * FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND "targetId" = $TargetID OR "moderatorId" = $ModeratorID LIMIT 50',
			{
				bind: { GuildID: guildID, TargetID: targetID, ModeratorID: targetID },
				type: QueryTypes.SELECT,
			},
		);
	}

	async isActive(guildID: Snowflake, infractionID: number): Promise<boolean | null> {
		const response: object = await sequelize.query(
			'SELECT active FROM infractions WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfractionID',
			{
				bind: { GuildID: guildID, InfractionID: infractionID },
				type: QueryTypes.SELECT,
			},
		);

		return <boolean>response[0]["active"];
	}

	async setActive(guildID: Snowflake, infractionID: number, active: boolean | number): Promise<void> {
		await sequelize.query(
			'UPDATE infractions SET active = $Active WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfractionID',
			{
				bind: { GuildID: guildID, InfractionID: infractionID, Active: active },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async updateModerator(guildID: Snowflake, infractionID: number, moderator: User): Promise<void> {
		await sequelize.query(
			'UPDATE infractions SET (moderator, "moderatorId") = ($ModTag, $ModID) WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfractionID',
			{
				bind: { ModTag: moderator.tag, ModID: moderator.id, GuildID: guildID, InfractionID: infractionID },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async updateReason(guildID: Snowflake, infractionID: number, reason: string): Promise<void> {
		await sequelize.query(
			'UPDATE infractions SET reason = $Reason WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND id = $InfractionID',
			{
				bind: { Reason: reason, GuildID: guildID, InfractionID: infractionID },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async getLatestMute(guildID: Snowflake, targetID: Snowflake): Promise<object | undefined> {
		const response: object[] = await sequelize.query(
			'SELECT * FROM infractions WHERE action = \'Mute\' AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID) AND "targetId" = $TargetID',
			{
				bind: { GuildID: guildID, TargetID: targetID },
				type: QueryTypes.SELECT,
			},
		);

		return response[response.length - 1];
	}
}

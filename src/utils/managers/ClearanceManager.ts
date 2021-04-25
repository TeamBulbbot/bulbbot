import { Message, Snowflake } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import moment from "moment";

export default class {
	async getClearanceList(guildID: Snowflake): Promise<object> {
		const data: object = await sequelize.query(
			'SELECT * FROM "guildOverrideCommands" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID },
				type: QueryTypes.SELECT,
			},
		);

		const response: object = await sequelize.query(
			'SELECT * FROM "guildModerationRoles" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID },
				type: QueryTypes.SELECT,
			},
		);

		return [data, response];
	}

	async editCommandOverride(guildID: Snowflake, name: string, clearance: number): Promise<void> {
		await sequelize.query(
			'UPDATE "guildOverrideCommands" SET "clearanceLevel" = $Clearance WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID, CommandName: name, Clearance: clearance },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async enableCommand(guildID: Snowflake, name: string, enabled: boolean): Promise<void> {
		await sequelize.query(
			'UPDATE "guildOverrideCommands" SET enabled = $Enabled WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID, CommandName: name, Enabled: enabled },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async createCommandOverride(guildID: Snowflake, name: string, enabled: boolean = true, clearance: number): Promise<void> {
		await sequelize.query(
			'INSERT INTO "guildOverrideCommands" (enabled, "commandName", "clearanceLevel", "createdAt", "updatedAt", "guildId") VALUES ($Enabled, $CommandName, $Clearance, $CreatedAt, $EditedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildID))',
			{
				bind: {
					Enabled: enabled,
					CommandName: name,
					Clearance: clearance,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
					GuildID: guildID,
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async getCommandOverride(guildID: Snowflake, name: string): Promise<object | undefined> {
		const response: object = await sequelize.query(
			'SELECT * FROM "guildOverrideCommands" WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { CommandName: name, GuildID: guildID },
				type: QueryTypes.SELECT,
			},
		);

		return response[0];
	}

	async deleteCommandOverride(guildID: Snowflake, name: string): Promise<void> {
		await sequelize.query(
			'DELETE FROM "guildOverrideCommands" WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID, CommandName: name },
				type: QueryTypes.DELETE,
			},
		);
	}

	async createRoleOverride(guildID: Snowflake, roleID: Snowflake, clearance: number): Promise<void> {
		await sequelize.query(
			'INSERT INTO "guildModerationRoles" ("roleId", "clearanceLevel", "createdAt", "updatedAt", "guildId") VALUES ($RoleID, $Clearance, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildID))',
			{
				bind: { RoleID: roleID, Clearance: clearance, CreatedAt: moment().format(), UpdatedAt: moment().format(), GuildID: guildID },
				type: QueryTypes.INSERT,
			},
		);
	}

	async editRoleOverride(guildID: Snowflake, roleID: Snowflake, clearance: number): Promise<void> {
		await sequelize.query(
			'UPDATE "guildModerationRoles" SET "clearanceLevel" = $Clearance WHERE "roleId" = $RoleID AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { Clearance: clearance, RoleID: roleID, GuildID: guildID },
				type: QueryTypes.UPDATE,
			},
		);
	}

	async deleteRoleOverride(guildID: Snowflake, roleID: Snowflake): Promise<void> {
		await sequelize.query(
			'DELETE FROM "guildModerationRoles" WHERE "roleId" = $RoleID AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: guildID, RoleID: roleID },
				type: QueryTypes.DELETE,
			},
		);
	}

	async getUserClearance(message: Message): Promise<number> {
		if (message.guild?.ownerID === message.author.id) return 100;
		if (message.member?.hasPermission("ADMINISTRATOR")) return 75;

		const response: object[] = await sequelize.query(
			'SELECT * FROM "guildModerationRoles" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { GuildID: message.guild?.id },
				type: QueryTypes.SELECT,
			},
		);

		let clearance: number = 0;
		response.forEach(entry => {
			if (entry["clearanceLevel"] > clearance && message.member?.roles.cache.find(r => r.id === entry["roleId"])) clearance = entry["clearanceLevel"];
		});

		return clearance;
	}
}

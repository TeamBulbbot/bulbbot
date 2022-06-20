import { Interaction, Permissions, Snowflake } from "discord.js";
import { sequelize } from "../database/connection";
import { QueryTypes } from "sequelize";
import moment from "moment";
import CommandContext from "src/structures/CommandContext";
import { GuildCommandOverride, GuildRoleOverride } from "../types/DatabaseStructures";
import prisma from "../../prisma";

export default class {
	async getClearanceList(guildId: Maybe<Snowflake>) {
		if (!guildId) return undefined;
		return await prisma.bulbGuild.findUnique({
			select: {
				guildOverrideCommands: true,
				guildModerationRoles: true,
			},
			where: {
				guildId,
			},
		});
	}

	async editCommandOverride(guildId: Maybe<Snowflake>, name: string, clearance: number): Promise<void> {
		if (!guildId) return;
		await prisma.guildOverrideCommand.updateMany({
			data: {
				clearanceLevel: clearance,
			},
			where: {
				commandName: name,
				bulbGuild: {
					guildId,
				},
			},
		});
	}

	async setEnabled(guildId: Maybe<Snowflake>, name: string, enabled = true): Promise<void> {
		if (!guildId) return;
		await sequelize.query('UPDATE "guildOverrideCommands" SET "enabled" = $Enabled WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildId, CommandName: name, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	async enableCommand(guildId: Maybe<Snowflake>, name: string, enabled: boolean): Promise<void> {
		if (!guildId) return;
		await sequelize.query('UPDATE "guildOverrideCommands" SET enabled = $Enabled WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildId, CommandName: name, Enabled: enabled },
			type: QueryTypes.UPDATE,
		});
	}

	async createCommandOverride(guildId: Maybe<Snowflake>, name: string, enabled = true, clearance: number): Promise<void> {
		if (!guildId) return;
		await sequelize.query(
			'INSERT INTO "guildOverrideCommands" (enabled, "commandName", "clearanceLevel", "createdAt", "updatedAt", "guildId") VALUES ($Enabled, $CommandName, $Clearance, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildID))',
			{
				bind: {
					Enabled: enabled,
					CommandName: name,
					Clearance: clearance,
					CreatedAt: moment().format(),
					UpdatedAt: moment().format(),
					GuildID: guildId,
				},
				type: QueryTypes.INSERT,
			},
		);
	}

	async getCommandOverride(guildId: Maybe<Snowflake> | undefined, name: string): Promise<GuildCommandOverride | undefined> {
		if (!guildId) return undefined;
		const response: GuildCommandOverride[] = await sequelize.query(
			'SELECT * FROM "guildOverrideCommands" WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)',
			{
				bind: { CommandName: name, GuildID: guildId },
				type: QueryTypes.SELECT,
			},
		);

		return response[0];
	}

	async deleteCommandOverride(guildId: Maybe<Snowflake>, name: string): Promise<void> {
		if (!guildId) return;
		await sequelize.query('DELETE FROM "guildOverrideCommands" WHERE "commandName" = $CommandName AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildId, CommandName: name },
			type: QueryTypes.DELETE,
		});
	}

	async createRoleOverride(guildId: Maybe<Snowflake>, roleID: Snowflake, clearance: number): Promise<void> {
		if (!guildId) return;
		await sequelize.query(
			'INSERT INTO "guildModerationRoles" ("roleId", "clearanceLevel", "createdAt", "updatedAt", "guildId") VALUES ($RoleID, $Clearance, $CreatedAt, $UpdatedAt, (SELECT id FROM guilds WHERE "guildId" = $GuildID))',
			{
				bind: { RoleID: roleID, Clearance: clearance, CreatedAt: moment().format(), UpdatedAt: moment().format(), GuildID: guildId },
				type: QueryTypes.INSERT,
			},
		);
	}

	async getRoleOverride(guildId: Maybe<Snowflake>, roleID: Snowflake): Promise<GuildRoleOverride | undefined> {
		if (!guildId) return undefined;
		const response: GuildRoleOverride[] = await sequelize.query('SELECT * FROM "guildModerationRoles" WHERE "roleId" = $RoleID AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { RoleID: roleID, GuildID: guildId },
			type: QueryTypes.SELECT,
		});

		return response[0];
	}

	async editRoleOverride(guildId: Maybe<Snowflake>, roleID: Snowflake, clearance: number): Promise<void> {
		if (!guildId) return;
		await sequelize.query('UPDATE "guildModerationRoles" SET "clearanceLevel" = $Clearance WHERE "roleId" = $RoleID AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { Clearance: clearance, RoleID: roleID, GuildID: guildId },
			type: QueryTypes.UPDATE,
		});
	}

	async deleteRoleOverride(guildId: Maybe<Snowflake>, roleID: Snowflake): Promise<void> {
		if (!guildId) return;
		await sequelize.query('DELETE FROM "guildModerationRoles" WHERE "roleId" = $RoleID AND "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: guildId, RoleID: roleID },
			type: QueryTypes.DELETE,
		});
	}

	async getUserClearance(context: CommandContext): Promise<number> {
		if (!context.guild || !context.member) return 0;
		if (context.guild.ownerId === context.member.user.id) return 100;
		if (context.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return 75;

		const response: Record<string, any> = await sequelize.query('SELECT * FROM "guildModerationRoles" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: context.guild.id },
			type: QueryTypes.SELECT,
		});

		let clearance = 0;
		response.forEach((entry) => {
			if (entry.clearanceLevel > clearance && context.member?.roles.cache.find((r) => r.id === entry.roleId)) clearance = entry.clearanceLevel;
		});

		return clearance;
	}

	/** @deprecated */
	async getUserClearanceFromInteraction(interaction: Interaction): Promise<number> {
		if (interaction.guild?.ownerId === interaction.user.id) return 100;
		if (interaction.member?.permissions["bitfield"] & BigInt(8)) return 75;

		const response: Record<string, any> = await sequelize.query('SELECT * FROM "guildModerationRoles" WHERE "guildId" = (SELECT id FROM guilds WHERE "guildId" = $GuildID)', {
			bind: { GuildID: interaction.guild?.id },
			type: QueryTypes.SELECT,
		});

		let clearance = 0;
		response.forEach((entry) => {
			if (entry.clearanceLevel > clearance && interaction.member?.roles["member"]["_roles"].includes(entry.roleId)) clearance = entry.clearanceLevel;
		});

		return clearance;
	}
}

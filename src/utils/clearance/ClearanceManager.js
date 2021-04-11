const sequelize = require("../database/connection");

module.exports = class ClearanceManager {
	//FIXME: I actually dunno what this does. Pls Philip fix the JavaDoc
	/**
	 *
	 * @param   guildId
	 * @returns {Promise<number>}
	 */
	async getClearanceList(guildId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					required: false,
				},
				{
					model: sequelize.models.guildOverrideCommands,
					required: false,
				},
			],
		});

		if (dbGuild === null) return null;

		return dbGuild;
	}

	/**
	 * Edits the selected command override
	 *
	 * @param guildId              ID of the {@link Guild} where the override should be edited
	 * @param commandName          The command override name
	 * @param clearanceLevel       The new clearance level
	 * @returns {Promise<boolean>}
	 */
	async editCommand(guildId, commandName, clearanceLevel) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName,
					},
				},
			],
		});

		if (dbGuild === null) return false;

		dbGuild["guildOverrideCommands"][0].clearanceLevel = clearanceLevel;
		await dbGuild["guildOverrideCommands"][0].save();
		return true;
	}

	/**
	 * Enables the selected command in the provided {@link Guild}
	 *
	 * @param guildId              ID of the {@link Guild} where the command should be enabled
	 * @param commandName          Name of the command that should be enabled
	 * @returns {Promise<boolean>}
	 */
	async enableCommand(guildId, commandName) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName,
					},
				},
			],
		});

		dbGuild["guildOverrideCommands"][0].enabled = true;
		await dbGuild["guildOverrideCommands"][0].save();
		return true;
	}

	/**
	 * Disables the selected command in the provided {@link Guild}
	 *
	 * @param guildId              ID of the {@link Guild} where the command should be disabled
	 * @param command              Name of the command that should be disabled
	 * @returns {Promise<boolean>}
	 */
	async disableCommand(guildId, command) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName: command.name,
					},
				},
			],
		});

		if (dbGuild === null) {
			await this.createCommandOverride(guildId, command.name, false, command.clearance);
			return true;
		}

		dbGuild["guildOverrideCommands"][0].enabled = false;
		await dbGuild["guildOverrideCommands"][0].save();
		return true;
	}

	/**
	 * Creates a command override for the provided guild
	 *
	 * @param guildId               Guild ID
	 * @param enabled               If the command is enabled or disabled
	 * @param commandName           Name of the command
	 * @param newClearanceLevel     The new clearance level for the command
	 * @returns {Promise<void>}
	 */
	async createCommandOverride(guildId, commandName, enabled, newClearanceLevel) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					required: false,
					where: {
						commandName,
					},
				},
			],
		});
		if (dbGuild === null) return;
		if (dbGuild["guildOverrideCommands"][0] !== undefined) return;

		await sequelize.models.guildOverrideCommands.create({
			enabled,
			commandName,
			clearanceLevel: newClearanceLevel,
			guildId: dbGuild.id,
		});
	}

	/**
	 * Returns the override for the provided command in the selected {@link Guild}
	 *
	 * @param guildId        ID of the {@link Guild} where the command should be enabled
	 * @param commandName    Name of the command that should be searched for
	 * @returns {Promise<*>}
	 */
	async getCommandOverride(guildId, commandName) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					required: false,
					where: {
						commandName,
					},
				},
			],
		});
		if (dbGuild["guildOverrideCommands"].length === 0) return;
		return dbGuild["guildOverrideCommands"][0];
	}

	/**
	 * Deletes the selected command override in the provided {@link Guild}
	 *
	 * @param guildId              ID of the {@link Guild} where the command should be enabled
	 * @param commandName          Name of the command that should be deleted
	 * @returns {Promise<boolean>}
	 */
	async deleteCommandOverride(guildId, commandName) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					required: false,
					where: {
						commandName,
					},
				},
			],
		});
		if (dbGuild["guildOverrideCommands"][0] === undefined) return false;

		await dbGuild["guildOverrideCommands"][0].destroy();
		return true;
	}

	/**
	 * Creates a mod override for the provided {@link Role} ID
	 *
	 * @param guildId           ID of the {@link Guild} where the override should be created
	 * @param roleId            ID of the {@link Role} that should be overwritten
	 * @param clearanceLevel    The clearance level that should be assigned to the role
	 * @returns {Promise<void>}
	 */
	async createModOverride(guildId, roleId, clearanceLevel) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					required: false,
					where: {
						roleId,
					},
				},
			],
		});
		if (dbGuild === null) return;
		if (dbGuild["guildModerationRoles"][0] !== undefined) return;

		await sequelize.models.guildModerationRoles.create({
			roleId,
			clearanceLevel,
			guildId: dbGuild.id,
		});
	}

	/**
	 * Edits the selected {@link Role} override
	 *
	 * @param guildId              ID of the {@link Guild} where the override should be edited
	 * @param roleId               ID of the {@link Role} that should be edited
	 * @param clearanceLevel       The new clearance level that should be assigned to the role
	 * @returns {Promise<boolean>}
	 */
	async editModOverride(guildId, roleId, clearanceLevel) {
		// BUG
		// you are able to modify your own clearance level

		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					where: {
						roleId,
					},
				},
			],
		});

		if (dbGuild === null) return false;

		dbGuild["guildModerationRoles"][0].clearanceLevel = clearanceLevel;
		await dbGuild["guildModerationRoles"][0].save();
		return true;
	}

	/**
	 * Deletes the selected {@link Role} override
	 *
	 * @param guildId              ID of the {@link Guild} where the override should be deleted
	 * @param roleId               ID of the {@link Role} that should be deleted
	 * @returns {Promise<boolean>}
	 */
	async deleteModOverride(guildId, roleId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					required: false,
					where: {
						roleId,
					},
				},
			],
		});

		if (dbGuild["guildModerationRoles"][0] === undefined) return false;

		await dbGuild["guildModerationRoles"][0].destroy();
		return true;
	}

	/**
	 * returns the provided {@link User}'s clearance
	 *
	 * @param message             Message provided by the {@link message} event
	 * @param guildId             ID of the guild provided by the {@link message} event
	 * @returns {Promise<number>}
	 */
	async getUserClearance(message, guildId) {
		if (message.guild.ownerID === message.author.id) return 100;
		if (message.member.hasPermission(["ADMINISTRATOR"])) return 75;

		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					required: false,
				},
			],
		});

		let clearance = 0;
		dbGuild["guildModerationRoles"].forEach(role => {
			if (role.clearanceLevel > clearance && message.member.roles.cache.find(r => r.id === role.roleId)) clearance = role.clearanceLevel;
		});
		return parseInt(clearance);
	}
};

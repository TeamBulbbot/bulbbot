const sequelize = require("../../database/connection");

/**
 * Creates a command override for the provided guild
 *
 * @param guildId               Guild ID
 * @param enabled               If the command is enabled or disabled
 * @param commandName           Name of the command
 * @param newClearanceLevel     The new clearance level for the command
 * @returns {Promise<void>}
 */
module.exports = async (guildId, commandName, enabled, newClearanceLevel) => {
	const dbGuild = await sequelize.models.Guild.findOne({
		where: { GuildId: guildId },
		include: [
			{
				model: sequelize.models.GuildOverrideCommands,
				required: false,
				where: {
					CommandName: commandName,
				},
			},
		],
	});
	if (dbGuild === null) return;
	if (dbGuild.GuildOverrideCommands[0] !== undefined) return;

	await sequelize.models.GuildOverrideCommands.create({
		Enabled: enabled,
		CommandName: commandName,
		ClearanceLevel: newClearanceLevel,
		GuildId: dbGuild.id,
	});
};

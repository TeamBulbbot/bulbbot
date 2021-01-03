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
	if (dbGuild.guildOverrideCommands[0] !== undefined) return;

	await sequelize.models.guildOverrideCommands.create({
		enabled,
		commandName,
		clearanceLevel: newClearanceLevel,
		guildId: dbGuild.id,
	});
};

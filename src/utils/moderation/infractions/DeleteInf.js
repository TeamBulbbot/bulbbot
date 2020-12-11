const sequelize = require("../../database/connection");

/**
 * Deletes an infraction for the provided guild
 *
 * @param guildId       Guild ID where the infarction is being deleted
 * @param infId         Infraction ID
 * @returns {Promise<void>}
 */
module.exports = async (guildId, infId) => {
	const dbGuild = await sequelize.models.Guild.findOne({
		where: { GuildId: guildId },
		include: [
			{
				model: sequelize.models.Infraction,
				where: {
					id: infId,
				},
			},
		],
	});
	if (dbGuild === null) return;
	await dbGuild.Infractions[0].destroy();
};

const sequelize = require("../database/connection");
/**
 * Removed the specified Guild object from the database
 *
 * @param guildId       Guild ID parsed from the onGuildLeave event
 * @returns {Promise<void>}
 */
module.exports = async guildId => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{ model: sequelize.models.guildConfiguration },
			{ model: sequelize.models.automod },
			{ model: sequelize.models.guildLogging },
			{ model: sequelize.models.infraction },
			{ model: sequelize.models.starboard },
		],
	});

	if (dbGuild === null) {
		console.log(`Unable to find the db table for guild: ${guildId}`);
		return;
	}

	await dbGuild.destroy().catch(err => console.log(`Unable to delete the Guild table for: ${guildId}: `, err));
	await dbGuild.guildConfiguration.destroy().catch(err => console.log(`Unable to delete the GuildConfiguration table for: ${guildId}: `, err));
	await dbGuild.automod.destroy().catch(err => console.log(`Unable to delete the Automod table for: ${guildId}: `, err));
	await dbGuild.guildLogging.destroy().catch(err => console.log(`Unable to delete the GuildLogging table for: ${guildId}: `, err));
	await dbGuild.infractions.forEach(inf => inf.destroy().catch(err => console.log(`Unable to delete the Infraction table for: ${guildId}: `, err)));
	await dbGuild.starboard.destroy().catch(err => console.log(`Unable to delete the Starboard table for: ${guildId}: `, err));
};

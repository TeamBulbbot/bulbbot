const sequelize = require("../database/connection");

/**
 * Creates a new Guild object in the database
 *
 * @param guild     Parsed Guild object from the onGuildCreate event
 * @returns {Promise<void>}
 */
module.exports = async guild => {
	const config = await sequelize.models.guildConfiguration.create({
		prefix: global.config.prefix,
	});
	const logging = await sequelize.models.guildLogging.create({});

	const starboard = await sequelize.models.starboard.create({});

	const automod = await sequelize.models.automod.create({});

	await sequelize.models.guild.create({
		name: guild.name,
		guildId: guild.id,
		guildConfigurationId: config.id,
		guildLoggingId: logging.id,
		starboardId: starboard.id,
		automodId: automod.id
	});
};

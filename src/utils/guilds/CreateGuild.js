const sequelize = require("../database/connection");

/**
 * Creates a new Guild object in the database
 *
 * @param guild     Parsed Guild object from the onGuildCreate event
 * @returns {Promise<void>}
 */
module.exports = async guild => {
    const config = await sequelize.models.GuildConfiguration.create({
        Prefix: global.config.prefix,
    });
    const logging = await sequelize.models.GuildLogging.create({});

    const starboard = await sequelize.models.Starboard.create({});

    await sequelize.models.Guild.create({
        Name: guild.name,
        GuildId: guild.id,
        GuildConfigurationId: config.id,
        GuildLoggingId: logging.id,
        StarboardId: starboard.id,
    });
};

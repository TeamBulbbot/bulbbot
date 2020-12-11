const sequelize = require("../database/connection");

/**
 * Creates a new Guild object in the database
 *
 * @param guild     Parsed Guild object from the onGuildCreate event
 * @returns {Promise<void>}
 */
module.exports = async (guild) => {
    const config = await sequelize.models.GuildConfiguration.create({
        Prefix: process.env.PREFIX,
    });
    const logging = await sequelize.models.GuildLogging.create({})

    await sequelize.models.Guild.create({
        Name: guild.name,
        GuildId: guild.id,
        GuildConfigurationId: config.id,
        GuildLoggingId: logging.id
    })
};

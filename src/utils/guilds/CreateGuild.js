const sequelize = require("../database/connection");

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

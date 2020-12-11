const sequelize = require("../database/connection");
/**
 * Removed the specified Guild object from the database
 *
 * @param guildId       Guild ID parsed from the onGuildLeave event
 * @returns {Promise<void>}
 */
module.exports = async (guildId) => {
    const dbGuild = await sequelize.models.Guild.findOne({
        where: {GuildId: guildId},
        include: [
            {model: sequelize.models.GuildConfiguration},
            {model: sequelize.models.GuildLogging},
        ]
    })

    if(dbGuild === null){
        console.log(`Unable to find the db table for guild: ${guildId}`)
        return;
    }

    await dbGuild.destroy()
        .catch((err) => console.log(`Unable to delete the Guild table for: ${guildId}: `, err));
    await dbGuild.GuildConfiguration.destroy()
        .catch((err) => console.log(`Unable to delete the GuildConfiguration table for: ${guildId}: `, err));
    await dbGuild.GuildLogging.destroy()
        .catch((err) => console.log(`Unable to delete the GuildLogging table for: ${guildId}: `, err));

};

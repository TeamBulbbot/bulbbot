const sequelize = require("../database/connection");

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

    dbGuild.destroy()
        .catch((err) => console.log(`Unable to delete the Guild table for: ${guildId}: `, err));
    dbGuild.GuildConfiguration.destroy()
        .catch((err) => console.log(`Unable to delete the GuildConfiguration table for: ${guildId}: `, err));
    dbGuild.GuildLogging.destroy()
        .catch((err) => console.log(`Unable to delete the GuildLogging table for: ${guildId}: `, err));

};

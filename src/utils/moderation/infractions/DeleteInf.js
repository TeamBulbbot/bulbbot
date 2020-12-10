const sequelize = require("../../database/connection");

module.exports = async (guildId, infId) => {
    const dbGuild = await sequelize.models.Guild.findOne({
        where: {GuildId: guildId},
        include: [
            {
                model: sequelize.models.Infraction,
                where: {
                    id: infId,
                }
            },
        ]
    })
    if(dbGuild === null) return;
    await dbGuild.Infractions[0].destroy();
};

const sequelize = require("../database/connection");

module.exports = {
    GetGuild: async guildId => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [{model: sequelize.models.Starboard}],
        });

        if (dbGuild === null) return;

        return dbGuild;
    },

    CheckIfMessageAlreadyInDB: async (id, messageId) => {
        const guild = await sequelize.models.Starboard.findOne({
            where: {id},
            include: [
                {
                    model: sequelize.models.StarboardPost,
                    where: {
                        OGMessageId: messageId,
                    },
                },
            ],
        });

        if (guild === null) return false;

        return true;
    },
};

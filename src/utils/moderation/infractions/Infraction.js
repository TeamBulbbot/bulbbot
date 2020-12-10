const sequelize = require("../../database/connection");

module.exports = {
    async getAllInfs(guildId){
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {model: sequelize.models.Infraction},
            ]
        })

        return dbGuild.Infractions;
    },

    async getOffenderInfs(guildId, offenderId){
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {
                    model: sequelize.models.Infraction,
                    where: {
                        TargetId: offenderId,
                    }
                },
            ]
        })

        return dbGuild.Infractions;
    },

    async getModeratorInfs(guildId, moderatorId){
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {
                    model: sequelize.models.Infraction,
                    where: {
                        ModeratorId: moderatorId,
                    }
                },
            ]
        })

        return dbGuild.Infractions;
    }
}
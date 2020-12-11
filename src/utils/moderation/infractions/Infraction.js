const sequelize = require("../../database/connection");

module.exports = {
    /**
     * Returns all Infractions stored for the specified guild
     *
     * @param guildId           Guild ID
     * @returns {Promise<*>}    Returned infraction array
     */
    async getAllInfs(guildId){
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {model: sequelize.models.Infraction},
            ]
        })

        return dbGuild.Infractions;
    },

    /**
     * Returns an array of all Infraction for the searched user ID marked as offender
     * in the database
     *
     * @param guildId           Guild ID
     * @param offenderId        Searched user ID marked as offender in the database
     * @returns {Promise<*>}    Returned infraction array
     */
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

    /**
     * Returns an array of all Infractions for the specified user ID marked as Moderator
     * in the database
     *
     * @param guildId           Guild ID
     * @param moderatorId       Searched user ID marked as moderator in the database
     * @returns {Promise<*>}    Returned infraction array
     */
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
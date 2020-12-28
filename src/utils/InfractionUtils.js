const sequelize = require("./database/connection");

module.exports = {
    /**
     * Creates an infraction for the provided guild
     *
     * @param guildId               Guild ID where the Infraction is being stored from
     * @param action                Mod action type
     * @param reason                Reason specified by the responsible moderator
     * @param target                User receiving the infraction
     * @param targetId              ID of the user receiving the infraction
     * @param moderator             Moderator responsible for the infraction
     * @param moderatorId           ID of the responsible moderator
     * @returns InfId               The infraction id of the infraction created
     */
    createInfraction: async (guildId, action, reason, target, targetId, moderator, moderatorId) => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
        });
        if (dbGuild === null) return;

        const inf = await sequelize.models.Infraction.create({
            Action: action,
            Reason: reason,
            Target: target,
            TargetId: targetId,
            Moderator: moderator,
            ModeratorId: moderatorId,
            GuildId: dbGuild.id,
        });

        return inf.id;
    },

    /**
     * Deletes an infraction for the provided guild
     *
     * @param guildId       Guild ID where the infarction is being deleted
     * @param infId         Infraction ID
     * @returns {Promise<void>}
     */
    deleteInfraction: async (guildId, infId) => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {
                    model: sequelize.models.Infraction,
                    where: {
                        id: infId,
                    },
                },
            ],
        });
        if (dbGuild === null) return;
        await dbGuild.Infractions[0].destroy();
    },

    /**
     * Returns all Infractions stored for the specified guild
     *
     * @param guildId           Guild ID
     * @returns {Promise<*>}    Returned infraction array
     */
    getAllInfractions: async guildId => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [{model: sequelize.models.Infraction}],
        });

        if (dbGuild === null) return [];

        return dbGuild.Infractions;
    },

    /**
     * Returns an object array of all Infraction for the searched user ID marked as offender
     * in the database
     *
     * @param guildId           Guild ID
     * @param offenderId        Searched user ID marked as offender in the database
     * @returns {Promise<*>}    Returned infraction array
     */
    getOffenderInfractions: async (guildId, offenderId) => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {
                    model: sequelize.models.Infraction,
                    where: {
                        TargetId: offenderId,
                    },
                },
            ],
        });

        if (dbGuild === null) return [];

        return dbGuild.Infractions;
    },

    /**
     * Returns an object array of all Infractions for the specified user ID marked as Moderator
     * in the database
     *
     * @param guildId           Guild ID
     * @param moderatorId       Searched user ID marked as moderator in the database
     * @returns {Promise<*>}    Returned infraction array
     */
    getModeratorInfractions: async (guildId, moderatorId) => {
        const dbGuild = await sequelize.models.Guild.findOne({
            where: {GuildId: guildId},
            include: [
                {
                    model: sequelize.models.Infraction,
                    where: {
                        ModeratorId: moderatorId,
                    },
                },
            ],
        });

        if (dbGuild === null) return [];

        return dbGuild.Infractions;
    },
};
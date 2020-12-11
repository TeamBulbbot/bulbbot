const sequelize = require("../../database/connection");

/**
 * Creates the Infraction table in the database.
 *
 * @param guildId               Guild ID where the Infraction is being stored from
 * @param action                Mod action type
 * @param reason                Reason specified by the responsible moderator
 * @param target                User receiving the infraction
 * @param targetId              ID of the user receiving the infraction
 * @param moderator             Moderator responsible for the infraction
 * @param moderatorId           ID of the responsible moderator
 * @returns {Promise<void>}
 */
module.exports = async (guildId, action, reason, target, targetId, moderator, moderatorId) => {
    const dbGuild = await sequelize.models.Guild.findOne({
        where: {GuildId: guildId},
    })
    if(dbGuild === null) return;

    await sequelize.models.Infraction.create({
        Action: action,
        Reason: reason,
        Target: target,
        TargetId: targetId,
        Moderator: moderator,
        ModeratorId: moderatorId,
        GuildId: dbGuild.id
    });
};

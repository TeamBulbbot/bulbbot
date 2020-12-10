const sequelize = require("../../database/connection");

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

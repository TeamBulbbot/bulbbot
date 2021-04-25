import { Sequelize } from "sequelize";

export default function (sequelize: Sequelize) {
    const {
        guild,
        guildConfiguration,
        guildLogging,
        guildModerationRoles,
        guildOverrideCommands,
        infraction,
        //starboard,
        //starboardPost,
        tempban,
        automod,
        tempmute
    } = sequelize.models;

    guild.belongsTo(guildConfiguration, {});
    guild.belongsTo(guildLogging, {});
    //guild.belongsTo(starboard, {});
    guild.belongsTo(automod, {})

    //starboard.hasMany(starboardPost, {});

    guild.hasMany(infraction, {});
    guild.hasMany(guildModerationRoles, {});
    guild.hasMany(guildOverrideCommands, {});

    guild.hasMany(tempban, {});
    guild.hasMany(tempmute, {});
}
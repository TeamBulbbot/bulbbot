function ApplyExtra(sequelize) {
    const {
        Guild,
        GuildConfiguration,
        GuildLogging,
        GuildModerationRoles,
        GuildOverrideCommands,
        Infraction,
    } = sequelize.models;

    GuildConfiguration.belongsTo(Guild);
    GuildLogging.belongsTo(Guild);
    Infraction.belongsTo(Guild);
    Guild.hasMany(GuildModerationRoles);
    Guild.hasMany(GuildOverrideCommands);
}

module.exports = { ApplyExtra };

function ApplyExtra(sequelize) {
	const { Guild, GuildConfiguration, GuildLogging, GuildModerationRoles, GuildOverrideCommands, Infraction } = sequelize.models;

	Guild.belongsTo(GuildConfiguration, {});
	Guild.belongsTo(GuildLogging, {});

	Guild.hasMany(Infraction, {});
}

module.exports = { ApplyExtra };

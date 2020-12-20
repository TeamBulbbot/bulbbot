function ApplyExtra(sequelize) {
	const { Guild, GuildConfiguration, GuildLogging, GuildModerationRoles, GuildOverrideCommands, Infraction, Starboard } = sequelize.models;

	Guild.belongsTo(GuildConfiguration, {});
	Guild.belongsTo(GuildLogging, {});
	Guild.belongsTo(Starboard, {});

	Guild.hasMany(Infraction, {});
	Guild.hasMany(GuildModerationRoles, {});
	Guild.hasMany(GuildOverrideCommands, {});
}

module.exports = { ApplyExtra };

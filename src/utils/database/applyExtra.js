function ApplyExtra(sequelize) {
	const {
		Guild,
		GuildConfiguration,
		GuildLogging,
		GuildModerationRoles,
		GuildOverrideCommands,
		Infraction,
		Starboard,
		StarboardPost,
	} = sequelize.models;

	Guild.belongsTo(GuildConfiguration, {});
	Guild.belongsTo(GuildLogging, {});
	Guild.belongsTo(Starboard, {});

	Starboard.hasMany(StarboardPost, {});

	Guild.hasMany(Infraction, {});
	Guild.hasMany(GuildModerationRoles, {});
	Guild.hasMany(GuildOverrideCommands, {});
}

module.exports = { ApplyExtra };

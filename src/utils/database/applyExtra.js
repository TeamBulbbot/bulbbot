function ApplyExtra(sequelize) {
	const {
		guild,
		guildConfiguration,
		guildLogging,
		guildModerationRoles,
		guildOverrideCommands,
		infraction,
		starboard,
		starboardPost,
		tempban,
	} = sequelize.models;

	guild.belongsTo(guildConfiguration, {});
	guild.belongsTo(guildLogging, {});
	guild.belongsTo(starboard, {});

	starboard.hasMany(starboardPost, {});

	guild.hasMany(infraction, {});
	guild.hasMany(guildModerationRoles, {});
	guild.hasMany(guildOverrideCommands, {});

	guild.hasMany(tempban, {});
}

module.exports = { ApplyExtra };

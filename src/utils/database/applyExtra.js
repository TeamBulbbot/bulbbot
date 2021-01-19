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
		automod
	} = sequelize.models;

	guild.belongsTo(guildConfiguration, {});
	guild.belongsTo(guildLogging, {});
	guild.belongsTo(starboard, {});
	guild.belongsTo(automod, {})

	starboard.hasMany(starboardPost, {});

	guild.hasMany(infraction, {});
	guild.hasMany(guildModerationRoles, {});
	guild.hasMany(guildOverrideCommands, {});

	guild.hasMany(tempban, {});
}

module.exports = { ApplyExtra };

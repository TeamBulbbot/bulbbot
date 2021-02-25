const sequelize = require("../database/connection");

module.exports = async guildId => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{ model: sequelize.models.guildConfiguration },
			{ model: sequelize.models.guildLogging },
			//	{ model: sequelize.models.guildOverrideCommands },
			//	{ model: sequelize.models.guildModerationRoles },
		],
	});

	return dbGuild;
};

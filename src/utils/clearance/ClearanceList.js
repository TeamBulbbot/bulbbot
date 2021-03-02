const sequelize = require("../database/connection");

module.exports = async guildId => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{
				model: sequelize.models.guildModerationRoles,
				required: false,
			},
			{
				model: sequelize.models.guildOverrideCommands,
				required: false,
			},
		],
	});

	if (dbGuild === null) return;

	return dbGuild;
};

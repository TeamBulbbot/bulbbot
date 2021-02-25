const sequelize = require("../../database/connection");

module.exports = async (guildId, roleId, clearanceLevel) => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{
				model: sequelize.models.guildModerationRoles,
				required: false,
				where: {
					roleId,
				},
			},
		],
	});
	if (dbGuild === null) return;
	if (dbGuild.guildModerationRoles[0] !== undefined) return;

	await sequelize.models.guildModerationRoles.create({
		roleId,
		clearanceLevel,
		guildId: dbGuild.id,
	});
};

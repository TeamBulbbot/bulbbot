const sequelize = require("../../database/connection");

module.exports = async (guildId, roleId) => {
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

	if (dbGuild.guildModerationRoles[0] === undefined) return false;

	await dbGuild.guildModerationRoles[0].destroy();
	return true;
};

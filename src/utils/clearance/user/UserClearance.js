const sequelize = require("../../database/connection");

module.exports = async (message, guildId) => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{
				model: sequelize.models.guildModerationRoles,
				required: false,
			},
		],
	});

	let clearance = 0;
	dbGuild.guildModerationRoles.forEach(role => {
		if (role.clearanceLevel > clearance && message.member.roles.cache.find(r => r.id === role.roleId)) clearance = role.clearanceLevel;
	});
	return parseInt(clearance);
};

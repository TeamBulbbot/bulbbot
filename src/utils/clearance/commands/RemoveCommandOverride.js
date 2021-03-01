const sequelize = require("../../database/connection");

module.exports = async (guildId, commandName) => {
	const dbGuild = await sequelize.models.guild.findOne({
		where: { guildId },
		include: [
			{
				model: sequelize.models.guildOverrideCommands,
				required: false,
				where: {
					commandName,
				},
			},
		],
	});
	if (dbGuild.guildOverrideCommands[0] === undefined) return false;

	await dbGuild.guildOverrideCommands[0].destroy();
	return true;
};

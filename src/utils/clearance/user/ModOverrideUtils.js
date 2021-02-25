const sequelize = require("../../database/connection");

module.exports = {
	async EditMod(guildId, roleId, clearanceLevel) {
		// BUG
		// you are able to modify your own clearance level

		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildModerationRoles,
					where: {
						roleId,
					},
				},
			],
		});

		if (dbGuild === null) return false;

		dbGuild.guildModerationRoles[0].clearanceLevel = clearanceLevel;
		await dbGuild.guildModerationRoles[0].save();
		return true;
	},
};

const sequelize = require("../database/connection");

module.exports = {
	ChangeModAction: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLoggings }],
		});

		dbGuild.guildLoggings.modAction = channelId;
		await dbGuild.guildLoggings.save();
	},
};

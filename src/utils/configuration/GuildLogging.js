const sequelize = require("../database/connection");

module.exports = {
	ChangeModAction: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildLoggings }],
		});

		dbGuild.GuildLoggings.ModAction = channelId;
		await dbGuild.GuildLoggings.save();
	},
};

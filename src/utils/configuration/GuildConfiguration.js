const sequelize = require("../database/connection");

module.exports = {
	ChangePrefix: async (guildId, newPrefix) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildConfiguration }],
		});

		dbGuild.GuildConfiguration.Prefix = newPrefix;
		await dbGuild.GuildConfiguration.save();
	},
};

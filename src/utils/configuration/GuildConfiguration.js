const sequelize = require("../database/connection");

module.exports = {
	ChangePrefix: async (guildId, prefix) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildConfiguration }],
		});

		dbGuild.GuildConfiguration.Prefix = prefix;
		await dbGuild.GuildConfiguration.save();
	},

	ChangeTrackAnalytics: async (guildId, value) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildConfiguration }],
		});

		dbGuild.GuildConfiguration.TrackAnalytics = value;
		await dbGuild.GuildConfiguration.save();
	},

	ChangeLanguage: async (guildId, language) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildConfiguration }],
		});

		dbGuild.GuildConfiguration.Language = language;
		await dbGuild.GuildConfiguration.save();
	},

	ChangeMuteRole: async (guildId, muteRoleId) => {
		const dbGuild = await sequelize.models.Guild.findOne({
			where: { GuildId: guildId },
			include: [{ model: sequelize.models.GuildConfiguration }],
		});

		dbGuild.GuildConfiguration.MuteRole = muteRoleId;
		await dbGuild.GuildConfiguration.save();
	},
};

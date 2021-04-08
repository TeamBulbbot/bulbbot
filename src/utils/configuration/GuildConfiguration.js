const sequelize = require("../database/connection");

module.exports = {
	ChangePrefix: async (guildId, prefix) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.prefix = prefix;
		await dbGuild.guildConfiguration.save();
	},

	ChangeLanguage: async (guildId, language) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.language = language;
		await dbGuild.guildConfiguration.save();
	},

	ChangeMuteRole: async (guildId, muteRoleId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.muteRole = muteRoleId;
		await dbGuild.guildConfiguration.save();
	},

	ChangeAutoRole: async(guildId, autoRoleID) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.autorole = autoRoleID;
		await dbGuild.guildConfiguration.save()
	},

	GetTimezone: async(guildId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		return dbGuild.guildConfiguration.timezone;
	},

	ChangeTimezone: async(guildId, timezone) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.timezone = timezone;
		await dbGuild.guildConfiguration.save()
	}
};

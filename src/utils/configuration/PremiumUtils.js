const sequelize = require("../database/connection");

module.exports = {
	Enable: async guildId => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.premiumGuild = true;
		await dbGuild.guildConfiguration.save();
	},

	Disable: async guildId => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild.guildConfiguration.premiumGuild = false;
		await dbGuild.guildConfiguration.save();
	},
};

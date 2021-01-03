const sequelize = require("../database/connection");

module.exports = {
	GetGuild: async guildId => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.starboard }],
		});

		if (dbGuild === null) return;

		return dbGuild;
	},

	CheckIfMessageAlreadyInDB: async (id, messageId) => {
		const guild = await sequelize.models.starboard.findOne({
			where: { id },
			include: [
				{
					model: sequelize.models.starboardPost,
					where: {
						ogMessageId: messageId,
					},
				},
			],
		});

		if (guild === null) return false;

		return true;
	},
};

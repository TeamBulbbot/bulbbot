const sequelize = require("../database/connection");

module.exports = {
	ChangeModAction: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.modAction = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeAutoMod: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.automod = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeMessage: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.message = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeRole: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.role = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeMember: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.member = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeChannel: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.channel = channelId;
		await dbGuild.guildLogging.save();
	},
	ChangeJoinLeave: async (guildId, channelId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild.guildLogging.joinLeave = channelId;
		await dbGuild.guildLogging.save();
	},
};

const sequelize = require("../../database/connection");
const CreateCommandOverride = require("./CreateCommandOverride");

module.exports = {
	async EditCommand(guildId, commandName, clearanceLevel) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName,
					},
				},
			],
		});

		if (dbGuild === null) return false;

		dbGuild.guildOverrideCommands[0].clearanceLevel = clearanceLevel;
		await dbGuild.guildOverrideCommands[0].save();
		return true;
	},
	async EnableCommand(guildId, commandName) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName,
					},
				},
			],
		});

		dbGuild.guildOverrideCommands[0].enabled = true;
		await dbGuild.guildOverrideCommands[0].save();
		return true;
	},
	async DisableCommand(guildId, command) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.guildOverrideCommands,
					where: {
						commandName: command.name,
					},
				},
			],
		});

		if (dbGuild === null) {
			CreateCommandOverride(guildId, command.name, false, command.clearance);
			return;
		}

		dbGuild.guildOverrideCommands[0].enabled = false;
		await dbGuild.guildOverrideCommands[0].save();
		return true;
	},
};

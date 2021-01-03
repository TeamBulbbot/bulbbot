const CreateGuild = require("./CreateGuild");
const DeleteGuild = require("./DeleteGuild");
const sequelize = require("../database/connection");

module.exports = {
	/**
	 * Fetches the Guild prefix from the database
	 *
	 * @param guild     Guild ID parsed from the message event
	 * @returns Guild prefix
	 */
	async getPrefix(guild) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (dbGuild === null) {
			await CreateGuild(guild);
			return global.config.prefix;
		}
		return dbGuild.guildConfiguration.prefix;
	},

	/**
	 *
	 * @param guild        Guild ID parsed from the message event
	 * @returns {Promise<{type: *}>}    Guild Prefix
	 */
	async getMuteRole(guild) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		return dbGuild.guildConfiguration.muteRole;
	},
	/**
	 * Removed and immediately created a new Guild object in the database
	 *
	 * @param guild     Specified Guild ID
	 * @returns {Promise<void>}
	 */
	async reloadGuild(guild) {
		await DeleteGuild(guild.id);
		await CreateGuild(guild);
	},
};

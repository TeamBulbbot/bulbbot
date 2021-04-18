const sequelize = require("./connection");

module.exports = class DatabaseManager {
	/**
	 * Created the Guild database record from provided {@link Guild} object
	 *
	 * @param {Guild} guild             The parsed {@link Guild} object from the {@link guildCreate} event
	 * @returns {Promise<void>}
	 */
	async createGuild(guild) {
		const config = await sequelize.models.guildConfiguration.create({
			prefix: global.config.prefix,
		});
		const logging = await sequelize.models.guildLogging.create({});

		const starboard = await sequelize.models.starboard.create({});

		const automod = await sequelize.models.automod.create({});

		await sequelize.models.guild.create({
			name: guild.name,
			guildId: guild.id,
			guildConfigurationId: config.id,
			guildLoggingId: logging.id,
			starboardId: starboard.id,
			automodId: automod.id,
		});
	}

	/**
	 * Deletes the guild record from the database
	 *
	 * @param {Snowflake} guildId           Guild ID parsed from the {@link guildDelete} event
	 * @returns {Promise<void>}
	 */
	async deleteGuild(guildId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{ model: sequelize.models.guildConfiguration },
				{ model: sequelize.models.automod },
				{ model: sequelize.models.guildLogging },
				{ model: sequelize.models.infraction },
				{ model: sequelize.models.starboard },
			],
		});

		if (dbGuild === null) {
			console.log(`[DB - DeleteGuild] Unable to find the db table for guild: ${guildID}`);
			return;
		}

		await dbGuild.destroy().catch(err => console.log(`[DB - DeleteGuild] Unable to delete the Guild table for: ${guildID}: `, err));
		await dbGuild["guildConfiguration"]
			.destroy()
			.catch(err => console.log(`[DB - DeleteGuild] Unable to delete the GuildConfiguration table for: ${guildID}: `, err));
		await dbGuild.automod.destroy().catch(err => console.log(`[DB - DeleteGuild] Unable to delete the Automod table for: ${guildID}: `, err));
		await dbGuild["guildConfiguration"]
			.destroy()
			.catch(err => console.log(`[DB - DeleteGuild] Unable to delete the GuildLogging table for: ${guildID}: `, err));
		await dbGuild.infractions.forEach(inf => {
			inf.destroy().catch(err => console.log(`[DB - DeleteGuild] Unable to delete the Infraction table for: ${guildID}: `, err));
		});
		await dbGuild["starboard"].destroy().catch(err => console.log(`[DB - DeleteGuild] Unable to delete the Starboard table for: ${guildID}: `, err));
	}

	/**
	 * Returns the entire {@link GuildConfiguration} table for the provided guild
	 *
	 * @param {Guild} guild                    The {@link Guild} object that should be searched in the database
	 * @returns {Promise<null|string>} The returned {@link GuildConfiguration} table or null if not found
	 */
	async getConfig(guild) {
		const response = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (response === null) return null;
		else return response["guildConfiguration"];
	}

	/**
	 * Returns the full {@link Guild} configuration object
	 *
	 * @param {Snowflake} guildId             ID of the {@link Guild} that should be searched in the database
	 * @returns {Promise<string>}
	 */
	async getFullGuildConfig(guildId) {
		return await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{ model: sequelize.models.guildConfiguration },
				{ model: sequelize.models.guildLogging },
				//	{ model: sequelize.models.guildOverrideCommands },
				//	{ model: sequelize.models.guildModerationRoles },
			],
		});
	}

	/**
	 * Returns the Guild's prefix
	 *
	 * @deprecated
	 * @param {Guild} guild                    The {@link Guild} object that should be searched in the database
	 * @returns {Promise<null|string>} Returns the Guild's prefix or null if not found
	 */
	async getPrefix(guild) {
		const response = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (response === null) return null;
		else return response["guildConfiguration"].prefix;
	}

	/**
	 * Changed the prefix of the provided {@link Guild} object
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the prefix should be changed
	 * @param {String} prefix            The new prefix
	 * @returns {Promise<void>}
	 */
	async setPrefix(guildId, prefix) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].prefix = prefix;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Returns if the Guild is premium or not
	 *
	 * @deprecated
	 * @param {Guild} guild                    	The {@link Guild} object that should be searched in the database
	 * @returns {Promise<null|boolean>}	Returns a boolean if the Guild is premium or not and null if not found
	 */
	async getPremium(guild) {
		const response = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (response === null) return null;
		else return response["guildConfiguration"].premiumGuild;
	}

	/**
	 * Enables or disabled BulbBot premium for the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where BulbBot premium should be enabled/disabled
	 * @param {boolean} premium           Boolean value, either true of false. Indicates whether premium should be enabled or disabled
	 * @returns {Promise<void>}
	 */
	async setPremium(guildId, premium) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].premiumGuild = premium;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Returns the Mute role for the provided guild
	 *
	 * @param {Guild} guild                  The {@link Guild} object that should be searched in the database
	 * @returns {Promise<Role|null>} The returned Mute role or null if not found
	 */
	async getMuteRole(guild) {
		const response = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (response === null) return null;
		else return response["guildConfiguration"].muteRole;
	}

	/**
	 * Changes the Mute {@link Role} in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the mute role should be changed
	 * @param {Snowflake} muteRoleID        ID of the Mute {@link Role}
	 * @returns {Promise<void>}
	 */
	async setMuteRole(guildId, muteRoleID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].muteRole = muteRoleID;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Returns the Auto role for the provided guild
	 *
	 * @param {Guild} guild                  The {@link Guild} object that should be searched in the database
	 * @returns {Promise<Role|null>} The returned Auto role or null if not found
	 */
	async getAutoRole(guild) {
		const response = await sequelize.models.guild.findOne({
			where: { guildId: guild.id },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (response === null) return null;
		else return response["guildConfiguration"].autorole;
	}

	/**
	 * Changes the Auto {@link Role} in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the auto role should be changed
	 * @param {Snowflake} autoRoleID        ID of the Auto {@link Role}
	 * @returns {Promise<void>}
	 */
	async setAutoRole(guildId, autoRoleID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].autorole = autoRoleID;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Changes the default language in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the default language should be changed
	 * @param {String} language          The new updated language resolvable.
	 * @see Language
	 * @returns {Promise<void>}
	 */
	async setLanguage(guildId, language) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].language = language;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Returns the timezone configuration for the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId             The {@link Guild} object that should be searched in the database
	 * @returns {Promise<string>} Returned {@link Guild} timezone
	 */
	async getTimezone(guildId) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		if (dbGuild === null) return "UTC";

		return dbGuild["guildConfiguration"].timezone;
	}

	/**
	 * Changes the timezone in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           The {@link Guild} object that should be searched in the database
	 * @param {String} timezone          The timezone resolvable that should be updated
	 * @returns {Promise<void>}
	 */
	async setTimezone(guildId, timezone) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildConfiguration }],
		});

		dbGuild["guildConfiguration"].timezone = timezone;
		await dbGuild["guildConfiguration"].save();
	}

	/**
	 * Changes the ModAction logging channel in the provided {@link Guild}
	 *
	 * @param guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param channelID
	 * @returns {Promise<void>}
	 */
	async setModAction(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].modAction = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 * Changes the ModAction logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setAutoMod(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].automod = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 * Changes the Message logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setMessage(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].message = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 * Changes the Role logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setRole(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].role = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 * Changes the Member logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setMember(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].member = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 * Changes the Channel logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setChannel(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].channel = channelID;
		await dbGuild["guildLogging"].save();
	}

	/**
	 *Changes the JoinLeave logging channel in the provided {@link Guild}
	 *
	 * @param {Snowflake} guildId           ID of the {@link Guild} where the logging channel should be updated
	 * @param {Snowflake} channelID         ID of the {@link Channel} where the actions should be logged
	 * @returns {Promise<void>}
	 */
	async setJoinLeave(guildId, channelID) {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.guildLogging }],
		});

		dbGuild["guildLogging"].joinLeave = channelID;
		await dbGuild["guildLogging"].save();
	}
};

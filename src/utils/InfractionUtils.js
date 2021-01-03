const sequelize = require("./database/connection");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * Creates an infraction for the provided guild
	 *
	 * @param guildId               Guild ID where the Infraction is being stored in
	 * @param action                Mod action type
	 * @param active                false, true, Unix
	 * @param reason                Reason specified by the responsible moderator
	 * @param target                User receiving the infraction
	 * @param targetId              ID of the user receiving the infraction
	 * @param moderator             Moderator responsible for the infraction
	 * @param moderatorId           ID of the responsible moderator
	 * @returns InfId               The ID of the created infraction
	 */
	createInfraction: async (guildId, action, active, reason, target, targetId, moderator, moderatorId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
		});
		if (dbGuild === null) return;

		const inf = await sequelize.models.infraction.create({
			action,
			active,
			reason,
			target,
			targetId,
			moderator,
			moderatorId,
			guildId: dbGuild.id,
		});

		return inf.id;
	},

	/**
	 * Deletes an infraction for the provided guild
	 *
	 * @param guildId       Guild ID where the infarction is being deleted
	 * @param infId         Infraction ID
	 * @returns {Promise<boolean>}
	 */
	deleteInfraction: async (guildId, infId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						id: infId,
					},
				},
			],
		});
		if (dbGuild === null) return false;
		await dbGuild.infractions[0].destroy();
		return true;
	},

	/**
	 * Returns the selected infraction
	 *
	 * @param guildId		Guild ID where the infraction is being stored
	 * @param infId			The unique ID of the infraction
	 * @returns {Promise<boolean|*>}	Returned infraction object
	 */
	getInfraction: async (guildId, infId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						id: infId,
					},
				},
			],
		});

		if (dbGuild === null) return false;
		return dbGuild.infractions[0];
	},

	/**
	 * Returns all Infractions stored for the specified guild
	 *
	 * @param guildId           Guild ID
	 * @returns {Promise<*[]|*>}    Returned infraction array
	 */
	getAllInfractions: async guildId => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [{ model: sequelize.models.infraction }],
		});

		if (dbGuild === null) return null;

		return dbGuild.infractions.reverse();
	},

	/**
	 * Returns an object array of all Infraction for the searched user ID marked as offender
	 * in the database
	 *
	 * @param guildId           Guild ID
	 * @param offenderId        Searched user ID marked as offender in the database
	 * @returns {Promise<*[]|*>}    Returned infraction array
	 */
	getOffenderInfractions: async (guildId, offenderId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						targetId: offenderId,
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	},

	/**
	 * Returns an object array of all Infractions for the specified user ID marked as Moderator
	 * in the database
	 *
	 * @param guildId           Guild ID
	 * @param moderatorId       Searched user ID marked as moderator in the database
	 * @returns {Promise<*[]|*>}    Returned infraction array
	 */
	getModeratorInfractions: async (guildId, moderatorId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						moderatorId,
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	},

	/**
	 * Returns an array of Infractions where the specified user ID is either stored an Target ID or Moderator ID
	 *
	 * @param guildId		ID of the guild where the Infractions are being stored
	 * @param moderatorId	ID of the user being searched
	 * @param targetId		ID of the user being searched
	 * @returns {Promise<*[]|*>}		Returned array of infractions
	 */
	getAllUserInfractions: async (guildId, moderatorId, targetId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						[Op.or]: [{ moderatorId }, { targetId }],
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse();
	},

	/**
	 * Sets the "active" column for the selected infraction to "active" in
	 * the database
	 *
	 * @param infId		Infraction ID
	 * @param active	The active value, either a boolean or a Unix timestamp
	 * @returns {Promise<void>}
	 */
	setActive: async (infId, active) => {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.active = active;
		await dbInf.save();
	},

	/**
	 * Returns the "active" value for the selected infraction
	 *
	 * @param infId		Infraction ID
	 * @returns {Promise<{allowNull: boolean, type: *}|*>}		Returned value, either a boolean or a Unix timestamp
	 */
	getActive: async infId => {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		return dbInf.active;
	},

	/**
	 * Sets the moderator and moderatorId fields of the specified Infraction to the new specified user values
	 *
	 * @param infId		Unique ID of the selected Infraction
	 * @param moderator		User object of the new Moderator
	 * @returns {Promise<void>}
	 */
	setModerator: async (infId, moderator) => {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.moderator = moderator.tag;
		dbInf.moderatorId = moderator.id;
		await dbInf.save();
	},

	/**
	 * Sets the reason field of the specified Infraction to the new updated value
	 *
	 * @param infId		Unique ID of the selected infraction
	 * @param reason	New updated reason
	 * @returns {Promise<void>}
	 */
	setReason: async (infId, reason) => {
		const dbInf = await sequelize.models.infraction.findOne({
			where: { id: infId },
		});

		dbInf.reason = reason;
		await dbInf.save();
	},

	/**
	 * Returns the latest Mute infraction for the provided Guild and User
	 *
	 * @param guildId		Selected Guild ID
	 * @param offenderId	The selected User ID
	 * @returns {Promise<*[]|*>}		The latest Mute infraction stored in the database
	 */
	getLatestMute: async (guildId, offenderId) => {
		const dbGuild = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.infraction,
					where: {
						targetId: offenderId,
						action: "Mute",
					},
				},
			],
		});

		if (dbGuild === null) return [];

		return dbGuild.infractions.reverse()[0].id;
	},
};

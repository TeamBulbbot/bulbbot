const sequelize = require("../utils/database/connection");
const AutoModException = require("../structures/exceptions/AutoModException");
const { Warn, Kick, Ban } = require("../utils/moderation/actions");

module.exports = {
	resolveAction: async (client, message, action, reason) => {
		if (action === null) return;

		const target = {
			user: {
				tag: message.author.tag,
				id: message.author.id,
			},
		};

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await Warn(
					client,
					message.guild,
					target,
					client.user,
					client.bulbutils.translate("global_mod_action_log", {
						action: "Warned",
						moderator_tag: client.user.tag,
						moderator_id: client.user.id,
						target_tag: target.tag,
						target_id: target.id,
						reason,
					}),
					reason,
				);
				break;
			case "KICK":
				await Kick(
					client,
					message.guild,
					target.user,
					client.user,
					client.bulbutils.translate("global_mod_action_log", {
						action: "Kicked",
						moderator_tag: client.user.tag,
						moderator_id: client.user.id,
						target_tag: target.user.tag,
						target_id: target.user.id,
						reason,
					}),
					reason,
				);
				break;
			case "BAN":
				await Ban(
					client,
					message.guild,
					target.user,
					client.user,
					client.bulbutils.translate("global_mod_action_log", {
						action: "Banned",
						moderator_tag: client.user.tag,
						moderator_id: client.user.id,
						target_tag: target.user.tag,
						target_id: target.user.id,
						reason,
					}),
					reason,
				);
				break;
			default:
				throw new AutoModException(`'${action}' is not a valid resolvable action!`);
		}
	},

	getGuildAutoMod: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db;
	},
	getMentionsLimit: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.limitMentions;
	},

	getMessageLimit: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;

		return db.automod.limitMessages;
	},
};

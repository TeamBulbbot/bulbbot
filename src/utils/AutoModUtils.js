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

	getSettings: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return null;
		return db.automod;
	},

	changeLimit: async (guildId, part, limit) => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return false;
		SetLimit(db, part, limit);
	},

	changePunishment: async (guildId, part, punishment) => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return false;
		SetPunishment(db, part, punishment);
	},

	append: async (guildId, part, item) => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		switch (part.toLowerCase()) {
			case "website":
				if (db.automod.websiteWhitelist.includes(item)) return 1;

				db.automod.changed("websiteWhitelist", true);
				db.automod.websiteWhitelist.push(item);
				break;
			case "invites":
				if (db.automod.inviteWhitelist.includes(item)) return 1;

				db.automod.changed("inviteWhitelist", true);
				db.automod.inviteWhitelist.push(item);
				break;
			case "words":
				if (db.automod.wordBlacklist.includes(item)) return 1;

				db.automod.changed("wordBlacklist", true);
				db.automod.wordBlacklist.push(item);
				break;
			default:
				return -1;
		}

		db.automod.update(
			{
				websiteWhitelist: db.automod.websiteWhitelist,
			},
			{
				where: { guildId },
			},
		);

		await db.automod.save();
	},

	remove: async (guildId, part, item) => {
		function removeItemOnce(arr, value) {
			var index = arr.indexOf(value);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		}

		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		switch (part.toLowerCase()) {
			case "website":
				if (!db.automod.websiteWhitelist.includes(item)) return 1;

				db.automod.changed("websiteWhitelist", true);
				db.automod.websiteWhitelist = removeItemOnce(db.automod.websiteWhitelist, item);

				break;
			case "invites":
				if (!db.automod.inviteWhitelist.includes(item)) return 1;

				db.automod.changed("inviteWhitelist", true);
				db.automod.inviteWhitelist = removeItemOnce(db.automod.websiteWhitelist, item);
				break;
			case "words":
				if (!db.automod.wordBlacklist.includes(item)) return 1;

				db.automod.changed("wordBlacklist", true);
				db.automod.wordBlacklist = removeItemOnce(db.automod.websiteWhitelist, item);
				break;
			default:
				return -1;
		}

		db.automod.update(
			{
				websiteWhitelist: db.automod.websiteWhitelist,
			},
			{
				where: { guildId },
			},
		);

		await db.automod.save();
	},

	enable: async guildId => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return false;
		db.automod.enabled = true;
		await db.automod.save();
	},

	disable: async (guildId, part) => {
		const db = await sequelize.models.guild.findOne({
			where: { guildId },
			include: [
				{
					model: sequelize.models.automod,
				},
			],
		});

		if (!db) return false;
		if (!part) {
			db.automod.enabled = false;
			await db.automod.save();
		} else DisablePart(db, part);
	},
};

async function DisablePart(db, part) {
	if (db === null) return false;
	switch (part.toLowerCase()) {
		case "website":
			db.automod.punishmentWebsite = null;
			break;
		case "invites":
			db.automod.punishmentInvites = null;
			break;
		case "words":
			db.automod.punishmentWords = null;
			break;
		case "mentions":
			db.automod.punishmentMentions = null;
			break;
		case "messages":
			db.automod.punishmentMessages = null;
			break;
		default:
			return false;
	}

	await db.automod.save();
}

async function SetLimit(db, part, limit) {
	if (db === null) return false;
	switch (part.toLowerCase()) {
		case "mentions":
			db.automod.limitMentions = limit;
			break;
		case "messages":
			db.automod.limitMessages = limit;
			break;
		default:
			return false;
	}

	await db.automod.save();
}

async function SetPunishment(db, part, punishment) {
	if (db === null) return false;
	switch (part.toLowerCase()) {
		case "website":
			db.automod.punishmentWebsite = punishment;
			break;
		case "invites":
			db.automod.punishmentInvites = punishment;
			break;
		case "words":
			db.automod.punishmentWords = punishment;
			break;
		case "mentions":
			db.automod.punishmentMentions = punishment;
			break;
		case "messages":
			db.automod.punishmentMessages = punishment;
			break;
		default:
			return false;
	}

	await db.automod.save();
}

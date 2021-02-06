const sequelize = require("../database/connection");
const Emotes = require("../../emotes.json");
const moment = require("moment");
const utils = new (require("../BulbBotUtils"))();

module.exports = {
	SendModAction: async (client, guild, action, target, moderator, log, infId) => {
		const dbGuild = await GetDBGuild(guild.id);
		if (dbGuild.guildLogging.modAction === null) return;

		client.channels.cache.get(dbGuild.guildLogging.modAction).send(
			await utils.translate("global_logging_mod", {
				timestamp: moment().format("hh:mm:ss a"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infId,
				action: action,
				emoji: BetterActions(action),
			}),
		);
	},

	SendAutoUnban: async (client, guild, action, target, moderator, log, infId) => {
		const dbGuild = await GetDBGuild(guild.id);
		if (dbGuild.guildLogging.modAction === null) return;

		client.channels.cache.get(dbGuild.guildLogging.modAction).send(
			await utils.translate("global_logging_unban_auto", {
				timestamp: moment().format("hh:mm:ss a"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infId,
				action: action,
				emoji: BetterActions(action),
			}),
		);
	},

	SendModActionTemp: async (client, guild, action, target, moderator, log, infId, until) => {
		const dbGuild = await GetDBGuild(guild.id);
		if (dbGuild.guildLogging.modAction === null) return;

		client.channels.cache.get(dbGuild.guildLogging.modAction).send(
			await utils.translate("global_logging_mod_temp", {
				timestamp: moment().format("hh:mm:ss a"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infId,
				action: action,
				until: moment(until).format("MMM Do YYYY, h:mm:ss a"),
				emoji: BetterActions(action),
			}),
		);
	},

	SendModActionFile: async (client, guild, action, amount, file, channel, moderator) => {
		const dbGuild = await GetDBGuild(guild.id);
		if (dbGuild.guildLogging.modAction === null) return;

		client.channels.cache
			.get(dbGuild.guildLogging.modAction)
			.send(
				`\`[${moment().format("hh:mm:ss a")}]\` ${BetterActions("trash")} **${moderator.tag}** \`(${
					moderator.id
				})\` **${amount}** messages was removed in <#${channel.id}>`,
				{
					files: [file],
				},
			);
	},

	SendEventLog: async (client, guild, part, log) => {
		if (guild === undefined) return;

		const dbGuild = await GetDBGuild(guild.id);
		const logChannel = GetPart(dbGuild, part);

		if (logChannel === null) return;
		client.channels.cache.get(logChannel).send(`\`[${moment().format("hh:mm:ss a")}]\` ${log}`);
	},

	SendAutoModLog: async (client, guildId, log) => {
		if (guildId === undefined) return;

		const dbGuild = await GetDBGuild(guildId);
		const logChannel = GetPart(dbGuild, "automod");

		if (logChannel === null) return;
		client.channels.cache.get(logChannel).send(`\`[${moment().format("hh:mm:ss a")}]\` ${log}`);
	},
};

function GetPart(dbGuild, part) {
	switch (part.toLowerCase()) {
		case "message":
			part = dbGuild.guildLogging.message;
			break;
		case "role":
			part = dbGuild.guildLogging.role;
			break;
		case "member":
			part = dbGuild.guildLogging.member;
			break;
		case "channel":
			part = dbGuild.guildLogging.channel;
			break;
		case "joinleave":
			part = dbGuild.guildLogging.joinLeave;
			break;
		case "automod":
			part = dbGuild.guildLogging.automod;
			break;
		default:
			part = null;
			break;
	}

	return part;
}

function BetterActions(action) {
	switch (action.toLowerCase()) {
		case "softbanned":
			action = `${Emotes.actions.BAN}`;
			break;
		case "banned":
			action = `${Emotes.actions.BAN}`;
			break;
		case "unbanned":
			action = `${Emotes.actions.UNBAN}`;
			break;
		case "force-banned":
			action = `${Emotes.actions.BAN}`;
			break;
		case "kicked":
			action = `${Emotes.actions.KICK}`;
			break;
		case "muted":
			action = `${Emotes.actions.MUTE}`;
			break;
		case "warned":
			action = `${Emotes.actions.WARN}`;
			break;
		case "unmuted":
			action = `${Emotes.actions.UNBAN}`;
			break;
		case "automatically unmuted":
			action = `${Emotes.actions.UNBAN}`;
			break;
		case "automatically unbanned":
			action = `${Emotes.actions.UNBAN}`;
			break;
		case "temp-banned":
			action = `${Emotes.actions.BAN}`;
			break;
		default:
			break;
	}

	return action;
}

function GetDBGuild(guildId) {
	return sequelize.models.guild.findOne({
		where: { guildId },
		include: [{ model: sequelize.models.guildLogging }],
	});
}

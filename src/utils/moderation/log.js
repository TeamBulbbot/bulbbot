const sequelize = require("../database/connection");
const Emotes = require("../../emotes.json");
const moment = require("moment");
const utils = new (require("../BulbBotUtils"))();
require("moment-timezone");

const DatabaseManager = new (require("../database/DatabaseManager"));

module.exports = {
	SendMuteRestore: async (client, guild, target) => {
		const dbGuild = await GetDBGuild(guild.id);
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];

		if (dbGuild.guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(dbGuild.guildLogging.modAction);
		if (!modChannel.guild.me.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		modChannel.send(
			await utils.translate("global_logging_mute_restore", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target_tag: target.tag,
				user_id: target.id,
				emoji: BetterActions("muted"),
			}),
		);
	},

	SendModAction: async (client, guild, action, target, moderator, log, infId) => {
		const dbGuild = await GetDBGuild(guild.id);
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];

		if (dbGuild.guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(dbGuild.guildLogging.modAction);
		if (!modChannel.guild.me.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		modChannel.send(
			await utils.translate("global_logging_mod", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
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
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];
		if (dbGuild.guildLogging.modAction === null) return;
		if (target === undefined) return;

		const modChannel = client.channels.cache.get(dbGuild.guildLogging.modAction);
		if (!modChannel.guild.me.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		modChannel.send(
			await utils.translate("global_logging_unban_auto", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
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
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];
		if (dbGuild.guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(dbGuild.guildLogging.modAction);
		if (!modChannel.guild.me.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		modChannel.send(
			await utils.translate("global_logging_mod_temp", guild.id, {
				timestamp: moment().tz(zone).format("hh:mm:ssa z"),
				target_tag: target.tag,
				user_id: target.id,
				moderator_tag: moderator.tag,
				moderator_id: moderator.id,
				reason: log,
				infractionId: infId,
				action: action,
				until: moment(until).tz(zone).format("MMM Do YYYY, h:mm:ssa z"),
				emoji: BetterActions(action),
			}),
		);
	},

	SendModActionFile: async (client, guild, action, amount, file, channel, moderator) => {
		const dbGuild = await GetDBGuild(guild.id);
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];
		if (dbGuild.guildLogging.modAction === null) return;

		const modChannel = client.channels.cache.get(dbGuild.guildLogging.modAction);
		if (!modChannel.guild.me.permissionsIn(modChannel).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"])) return;

		modChannel.send(
			`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${BetterActions("trash")} **${moderator.tag}** \`(${
				moderator.id
			})\` has removed **${amount}** messages in <#${channel.id}>`,
			{
				files: [file],
			},
		);
	},

	SendEventLog: async (client, guild, part, log) => {
		if (guild === undefined) return;
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guild.id)];

		const dbGuild = await GetDBGuild(guild.id);
		const logChannel = GetPart(dbGuild, part);

		if (logChannel === null) return;
		client.channels.cache.get(logChannel).send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	},

	SendAutoModLog: async (client, guildId, log) => {
		if (guildId === undefined) return;
		const zone = client.bulbutils.timezones[await DatabaseManager.getTimezone(guildId)];

		const dbGuild = await GetDBGuild(guildId);
		const logChannel = GetPart(dbGuild, "automod");

		if (logChannel === null) return;
		client.channels.cache.get(logChannel).send(`\`[${moment().tz(zone).format("hh:mm:ssa z")}]\` ${log}`);
	},
};

function GetPart(dbGuild, part) {
	if (dbGuild === null) return null;
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
		case "trash":
			action = `${Emotes.other.TRASH}`;
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

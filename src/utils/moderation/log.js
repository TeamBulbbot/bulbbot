const sequelize = require("../database/connection");
const Emotes = require("../../emotes.json");
const moment = require("moment");
const utils = new (require("../BulbBotUtils"))()

module.exports = {
    SendModAction: async (client, guild, action, target, moderator, log, infId) => {
        const dbGuild = await GetDBGuild(guild.id);
        const betterAction = BetterActions(action);

        if (dbGuild.GuildLogging.ModAction === null) return;

        client.channels.cache
            .get(dbGuild.GuildLogging.ModAction)
            .send(utils.translate("global_logging_mod", {
                timestamp: moment().format("hh:mm:ss a"),
                target_tag: target.tag,
                user_id: target.id,
                moderator_tag: moderator.tag,
                moderator_id: moderator.id,
                reason: log,
                infractionId: infId,
                action: betterAction
            }))
    },

    SendAutoUnban: async (client, guild, action, target, moderator, log, infId) => {
        const dbGuild = await GetDBGuild(guild.id);
        const betterAction = BetterActions(action);

        if (dbGuild.GuildLogging.ModAction === null) return;

        client.channels.cache
            .get(dbGuild.GuildLogging.ModAction)
            .send(utils.translate("global_logging_unban_auto", {
                timestamp: moment().format("hh:mm:ss a"),
                target_tag: target.tag,
                user_id: target.id,
                moderator_tag: moderator.tag,
                moderator_id: moderator.id,
                reason: log,
                infractionId: infId,
                action: betterAction
            }))
    },

    SendModActionTemp: async (client, guild, action, target, moderator, log, infId, until) => {
        const dbGuild = await GetDBGuild(guild.id);
        const betterAction = BetterActions(action);

        if (dbGuild.GuildLogging.ModAction === null) return;

        client.channels.cache
            .get(dbGuild.GuildLogging.ModAction)
            .send(utils.translate("global_logging_mod_temp", {
                timestamp: moment().format("hh:mm:ss a"),
                target_tag: target.tag,
                user_id: target.id,
                moderator_tag: moderator.tag,
                moderator_id: moderator.id,
                reason: log,
                infractionId: infId,
                action: betterAction,
                until: moment(until).format("MMM Do YYYY, h:mm:ss a")
            }))
    },

    SendModActionFile: async (client, guild, action, amount, file, channel, moderator) => {
        const dbGuild = await GetDBGuild(guild.id);
        const betterAction = BetterActions(action);

        if (dbGuild.GuildLogging.ModAction === null) return;

        client.channels.cache
            .get(dbGuild.GuildLogging.ModAction)
            .send(
                `\`[${moment().format("hh:mm:ss a")}]\` ${betterAction} **${moderator.tag}** \`(${moderator.id})\` **${amount}** messages was removed in <#${
                    channel.id
                }>`,
                {
                    files: [file],
                },
            );
    },

    SendEventLog: async (client, guild, part, log) => {
        const dbGuild = await GetDBGuild(guild.id);
        const logChannel = GetPart(dbGuild, part);

        if (logChannel === null) return;
        client.channels.cache.get(logChannel).send(`\`[${moment().format("hh:mm:ss a")}]\` ${log}`);
    },
};

function GetPart(dbGuild, part) {
    switch (part.toLowerCase()) {
        case "message":
            part = dbGuild.GuildLogging.Message;
            break;
        case "role":
            part = dbGuild.GuildLogging.Role;
            break;
        case "member":
            part = dbGuild.GuildLogging.Member;
            break;
        case "channel":
            part = dbGuild.GuildLogging.Channel;
            break;
        case "joinleave":
            part = dbGuild.GuildLogging.JoinLeave;
            break;
        default:
            part = null;
            break;
    }

    return part;
}

function BetterActions(action) {
    switch (action.toLowerCase()) {
        case "softban":
            action = `${Emotes.actions.ban} Softbanned`;
            break;
        case "ban":
            action = `${Emotes.actions.ban} Banned`;
            break;
        case "unban":
            action = `${Emotes.actions.unban} Unbanned`;
            break;
        case "forceban":
            action = `${Emotes.actions.ban} Forcebanned`;
            break;
        case "kick":
            action = `${Emotes.actions.kick} Kicked`;
            break;
        case "purge":
            action = `${Emotes.actions.warn} Message purge by`;
            break;
        default:
            break;
    }

    return action;
}

function GetDBGuild(guildId) {
    return sequelize.models.Guild.findOne({
        where: {GuildId: guildId},
        include: [{model: sequelize.models.GuildLogging}],
    });
}

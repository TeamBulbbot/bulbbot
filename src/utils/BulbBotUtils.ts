import { Snowflake, GuildMember, GuildChannel } from "discord.js";
import * as enUS from "../languages/en-US.json"
import * as Emotes from "../emotes.json";

export default class {
    async translate(string: string, guildID: Snowflake = "742094927403679816", key: any): Promise<string> {
        let response: string = JSON.parse(JSON.stringify(enUS))[string].toString();

        response = response.replace(/({latency_bot})/g, key.latency_bot);
        response = response.replace(/({latency_ws})/g, key.latency_ws);

        response = response.replace(/({uptime})/g, key.uptime);
        response = response.replace(/({timestamp})/g, key.timestamp);
        response = response.replace(/({zone})/g, key.zone);
        response = response.replace(/({until})/g, key.until);

        response = response.replace(/({nick_old})/g, key.nick_old);
        response = response.replace(/({nick_new})/g, key.nick_new);
        response = response.replace(/({role})/g, key.role);

        response = response.replace(/({missing})/g, key.missing);

        response = response.replace(/({user_id})/g, key.user_id);
        response = response.replace(/({user_name})/g, key.user_name);
        response = response.replace(/({user_nickname})/g, key.user_nickname);
        response = response.replace(/({user_discriminator})/g, key.user_discriminator);
        response = response.replace(/({user_avatar})/g, key.user_avatar);
        response = response.replace(/({user_bot})/g, key.user_bot);
        //response = response.replace(/({user_age})/g, this.formatDays(key.user_age));
        //response = response.replace(/({user_premium})/g, this.formatDays(key.user_premium));
        //response = response.replace(/({user_joined})/g, this.formatDays(key.user_joined));
        response = response.replace(/({user_roles})/g, key.user_roles);
        response = response.replace(/({user_infractions})/g, key.user_infractions);
        if (key.user_infractions !== undefined) {
            if (key.user_infractions <= 1) response = response.replace(/({emote_inf})/g, Emotes.status.ONLINE);
            if (key.user_infractions === 2) response = response.replace(/({emote_inf})/g, Emotes.other.INF1);
            if (key.user_infractions > 2) response = response.replace(/({emote_inf})/g, Emotes.other.INF2);
        }

        response = response.replace(/({moderator_id})/g, key.moderator_id);
        response = response.replace(/({moderator_tag})/g, key.moderator_tag);
        response = response.replace(/({target_id})/g, key.target_id);
        response = response.replace(/({target_tag})/g, key.target_tag);
        response = response.replace(/({action})/g, key.action);
        response = response.replace(/({emoji})/g, key.emoji);

        response = response.replace(/({part})/g, key.part);
        response = response.replace(/({prefix})/g, key.prefix);
        response = response.replace(/({language})/g, key.language);
        response = response.replace(/({languages})/g, key.languages);
        response = response.replace(/({clearance})/g, key.clearance);
        response = response.replace(/({command})/g, key.command);

        response = response.replace(/({infractionId})/g, key.infractionId);

        if (key.guild) {
            response = response.replace(/({guild_owner_name})/g, key.guild.ownerID);
            response = response.replace(/({guild_owner_id})/g, key.guild.owner.id);
            //response = response.replace(/({guild_features})/g, this.guildFeatures(key.guild.features));
            //response = response.replace(/({guild_region})/g, this.guildRegion(key.guild.region));
            response = response.replace(/({guild_verification})/g, key.guild.verificationLevel);
            //response = response.replace(/({guild_age})/g, this.formatDays(key.guild.createdTimestamp));
            response = response.replace(/({guild_members})/g, key.guild.memberCount);

            response = response.replace(/({guild_max})/g, key.guild.maximumMembers);
            response = response.replace(/({guild_online})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "online").size);
            response = response.replace(/({guild_idle})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "idle").size);
            response = response.replace(/({guild_dnd})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "dnd").size);
            /*response = response.replace(
                /({guild_offline})/g,
                key.guild.memberCount -
                key.guild.members.cache.filter(m => m.presence.status === "dnd").size -
                key.guild.members.cache.filter(m => m.presence.status === "idle").size -
                key.guild.members.cache.filter(m => m.presence.status === "online").size,
            );*/

            response = response.replace(/({guild_voice})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "voice").size);
            response = response.replace(/({guild_text})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "category").size);
            response = response.replace(/({guild_category})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "text").size);

            response = response.replace(/({guild_booster_tier})/g, key.guild.premiumTier);
            response = response.replace(/({guild_booster_boosters})/g, key.guild.premiumSubscriptionCount);
        }

        if (key.channel) response = response.replace(/({channel})/g, key.channel);

        response = response.replace(/({user_tag})/g, key.user_tag);

        response = response.replace(/({before})/g, key.before);
        response = response.replace(/({after})/g, key.after);
        response = response.replace(/({after_channel_id})/g, key.after_channel_id);
        response = response.replace(/({after_id})/g, key.after_id);

        response = response.replace(/({content})/g, key.content);
        response = response.replace(/({attachment})/g, key.attachment);
        response = response.replace(/({embed})/g, key.embed);

        response = response.replace(/({channel_id})/g, key.channel_id);
        response = response.replace(/({channel_type})/g, key.channel_type);
        response = response.replace(/({channel_name})/g, key.channel_name);
        response = response.replace(/({channel_topic})/g, key.channel_topic);
        response = response.replace(/({oldchannel_topic})/g, key.oldchannel_topic);
        response = response.replace(/({newchannel_topic})/g, key.newchannel_topic);
        response = response.replace(/({oldchannel_name})/g, key.oldchannel_name);
        response = response.replace(/({newchannel_name})/g, key.newchannel_name);
        response = response.replace(/({oldchannel_type})/g, key.oldchannel_type);
        response = response.replace(/({newchannel_type})/g, key.newchannel_type);

        response = response.replace(/({slowmode})/g, key.slowmode);

        response = response.replace(/({guild_amount_roles})/g, key.guild_amount_roles);
        response = response.replace(/({guild_amount_emotes})/g, key.guild_amount_emotes);
        response = response.replace(/({guild_roles_left})/g, key.guild_roles_left);
        response = response.replace(/({guild_emotes_left})/g, key.guild_emotes_left);

        response = response.replace(/({arg})/g, key.arg);
        response = response.replace(/({arg_expected})/g, key.arg_expected);
        response = response.replace(/({arg_provided})/g, key.arg_provided);
        response = response.replace(/({usage})/g, key.usage);

        response = response.replace(/({reason})/g, key.reason);

        response = response.replace(/({snowflake})/g, key.snowflake);

        response = response.replace(/({level})/g, key.level);
        response = response.replace(/({count})/g, key.count);

        response = response.replace(/({item})/g, key.item);
        response = response.replace(/({part})/g, key.part);
        response = response.replace(/({punishment})/g, key.punishment);
        response = response.replace(/({limit})/g, key.limit);

        response = response.replace(/({bot_invite})/g, key.bot_invite);
        response = response.replace(/({support_guild})/g, key.support_guild);

        response = response.replace(/({emote_warn})/g, Emotes.actions.WARN);
        response = response.replace(/({emote_wrench})/g, Emotes.actions.WRENCH);
        response = response.replace(/({emote_github})/g, Emotes.other.GITHUB);
        response = response.replace(/({emote_owner})/g, Emotes.other.GUILD_OWNER);
        response = response.replace(/({emote_online})/g, Emotes.status.ONLINE);
        response = response.replace(/({emote_idle})/g, Emotes.status.IDLE);
        response = response.replace(/({emote_dnd})/g, Emotes.status.DND);
        response = response.replace(/({emote_offline})/g, Emotes.status.OFFLINE);
        response = response.replace(/({emote_loading})/g, Emotes.other.LOADING);
        response = response.replace(/({emote_join})/g, Emotes.other.JOIN);
        response = response.replace(/({emote_leave})/g, Emotes.other.LEAVE);
        response = response.replace(/({emote_success})/g, Emotes.other.SUCCESS);
        response = response.replace(/({emote_trash})/g, Emotes.other.TRASH);
        response = response.replace(/({emote_edit})/g, Emotes.other.EDIT);

        response = response.replace(/({emote_ban})/g, Emotes.actions.BAN);
        response = response.replace(/({emote_unban})/g, Emotes.actions.UNBAN);
        response = response.replace(/({emote_kick})/g, Emotes.actions.KICK);
        response = response.replace(/({emote_mute})/g, Emotes.actions.MUTE);

        response = response.replace(/({full_list})/g, key.full_list);

        if (key.user_infractions !== undefined) {
            /*const mf = new MessageFormat("en");
            const output = mf.compile(response);

            response = output({ infractions: key.user_infractions });*/
        }

        return response;
    }

    timezones: object = {
        ANAT: "Asia/Anadyr",
        AEDT: "Australia/Melbourne",
        AEST: "Australia/Brisbane",
        JST: "Asia/Tokyo",
        AWST: "Asia/Shanghai",
        WIB: "Asia/Jakarta",
        BTT: "Asia/Dhaka",
        UZT: "Asia/Tashkent",
        GST: "Asia/Dubai",
        MSK: "Europe/Moscow",
        CEST: "Europe/Brussels",
        BST: "Europe/London",
        GMT: "Africa/Accra",
        CVT: "Atlantic/Cape_Verde",
        WGST: "America/Nuuk",
        ART: "America/Buenos_Aires",
        EDT: "America/New_York",
        CDT: "America/Chicago",
        CST: "America/Mexico_City",
        PDT: "America/Los_Angeles",
        AKDT: "America/Anchorage",
        HDT: "America/Adak",
        HST: "Pacific/Honolulu",
        NUT: "Pacific/Fiji",
        AoE: "Pacific/Wallis",
        UTC: "UTC",
    }
}
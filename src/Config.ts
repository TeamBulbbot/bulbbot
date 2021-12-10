import { Snowflake, ColorResolvable, ActivityType, PresenceStatusData, IntentsString, PermissionString } from "discord.js";
import * as Emotes from "./emotes.json";

// @ts-ignore
function ArrayLiteralType<K extends string, T extends { [I: number]: K }>(arr: T): T {
	return arr;
}

export const name: string = "Bulbbot";
export const developers: string[] = ["190160914765316096", "439396770695479297", "193160566334947340"];
export const subDevelopers: string[] = [];
export const whitelistedGuilds: string[] = ["742094927403679816", "784408056997216327", "818176562901549066", "820945336327602186"];
export const version: string = "1.0.0";
export const lib: string = "Discord.JS";

// Configs
export const prefix: string = "!";
export const embedColor: ColorResolvable = "#5865F2";
export const massCommandSleep: number = 850;
export const intents: IntentsString[] = ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_INVITES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"];
export const defaultPerms: PermissionString[] = ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"];

// pm2 configs
export const pm2Name: string = "bulbbot";

// Client
export const tag: string = "Bulbbot#1439";
export const id: Snowflake = "868821693571932191";
export const activityName: string = "the light shine";
export const type: Exclude<ActivityType, "CUSTOM"> = "WATCHING";
export const status: PresenceStatusData = "online";
export const supportInvite: string = "https://discord.com/invite/WgEtVqyNFZ";
export const botInvite: string = "https://discord.com/oauth2/authorize?client_id=868821693571932191&permissions=261955644663&scope=bot+applications.commands";

export const discordApi = "https://discord.com/api/v9";

// Server
export const prometheusHost: string = "localhost";
export const prometheusPort: number = 7070;

// Logs
export const botDM: Snowflake = "822864336028565534";
export const invite: Snowflake = "822864350603640842";
export const error: Snowflake = "822864327303757874";
export const debug: Snowflake = "822864498251005952";
export const translation: Snowflake = "820689105854660699";

export const translatorEmojis: Record<string, string> = {
	emote_warn: Emotes.actions.WARN,
	emote_lock: Emotes.other.LOCK,
	emote_fail: Emotes.other.FAIL,
	emote_wrench: Emotes.actions.WRENCH,
	emote_github: Emotes.other.GITHUB,
	emote_owner: Emotes.other.GUILD_OWNER,
	emote_online: Emotes.status.ONLINE,
	emote_idle: Emotes.status.IDLE,
	emote_dnd: Emotes.status.DND,
	emote_offline: Emotes.status.OFFLINE,
	emote_loading: Emotes.other.LOADING,
	emote_join: Emotes.other.JOIN,
	emote_leave: Emotes.other.LEAVE,
	emote_success: Emotes.other.SUCCESS,
	emote_trash: Emotes.other.TRASH,
	emote_edit: Emotes.other.EDIT,
	emote_add: Emotes.other.ADD,
	emote_remove: Emotes.other.REMOVE,
	emote_ban: Emotes.actions.BAN,
	emote_kick: Emotes.actions.KICK,
	emote_unban: Emotes.actions.UNBAN,
	emote_mute: Emotes.actions.MUTE,
	emote_remind: Emotes.other.REMIND,
	emote_locked: Emotes.other.LOCKED,
	emote_unlocked: Emotes.other.UNLOCKED,
};

export const translatorConfig: Record<string, any> = {
	interpolation: {
		escapeValue: false,
	},
};

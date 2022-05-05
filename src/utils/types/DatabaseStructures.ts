import { Snowflake } from "discord.js";

export interface GuildConfiguration {
	prefix: string;
	language: string;
	timezone: string;
	muteRole: Snowflake;
	premiumGuild: boolean;
	autorole: Snowflake;
	actionsOnInfo: boolean;
	rolesOnLeave: boolean;
	manualNicknameInf: boolean;
	quickReasons: string[];
}

export interface Infraction {
	id: number;
	action: string;
	active: string;
	reason: string;
	target: string;
	targetId: string;
	moderator: string;
	moderatorId: string;
	createdAt: string;
	updatedAt: string;
	guildId: number;
}

export interface LoggingConfiguration {
	id: number;
	modAction: string;
	banpool: string;
	automod: string;
	message: string;
	role: string;
	member: string;
	channel: string;
	thread: string;
	invite: string;
	joinLeave: string;
	createdAt: string;
	updatedAt: string;
	other: string;
}

export interface AutoModConfiguration {
	id: number;
	enabled: boolean;
	websiteWhitelist: string[];
	punishmentWebsite: string;
	inviteWhitelist: string[];
	punishmentInvites: string;
	wordBlacklist: string[];
	wordBlacklistToken: string[];
	punishmentWords: string;
	limitMentions: number;
	punishmentMentions: string;
	limitMessages: number;
	punishmentMessages: string;
	timeoutMentions: number;
	timeoutMessages: number;
	punishmentAvatarBans: string;
	avatarHashes: string[];
	ignoreChannels: string[];
	ignoreRoles: string[];
	ignoreUsers: string[];
}

export interface Blacklist {
	isGuild: boolean;
	name: string;
	snowflakeId: string;
	reason: string;
	developerId: string;
}

export interface GuildRoleOverride {
	/*enabled: boolean;*/
	roleId: string;
	clearanceLevel: number;
}

export interface GuildCommandOverride {
	enabled: boolean;
	commandName: string;
	clearanceLevel: number;
}

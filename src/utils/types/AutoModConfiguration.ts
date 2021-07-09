export interface AutoModConfiguration {
	id: number;
	enabled: boolean;
	websiteWhitelist: string[];
	punishmentWebsite: string;
	inviteWhitelist: string[];
	punishmentInvites: string;
	wordBlacklist: string[];
	wordBlacklistToken?: string[];
	punishmentWords: string;
	limitMentions: number;
	punishmentMentions: string;
	limitMessages: number;
	punishmentMessages: string;
	timeoutMentions: number;
	timeoutMessages: number;
	ignoreChannels: string[];
	ignoreRoles: string[];
	ignoreUsers: string[];
}

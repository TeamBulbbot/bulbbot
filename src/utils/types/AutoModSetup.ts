export default interface AutoModSetup {
	websiteWhitelist?: string[];
	punishmentWebsite?: string;
	inviteWhitelist?: string[];
	punishmentInvites?: string;
	wordBlacklist?: string[];
	wordBlacklistToken?: string[];
	punishmentWords?: string;
	limitMentions?: number;
	punishmentMentions?: string;
	timeoutMentions?: number,
	limitMessages?: number;
	punishmentMessages?: string;
	timeoutMessages?: number,
	ignoreChannels?: string[];
	ignoreRoles?: string[];
	ignoreUsers?: string[];
}

enum AutoModPart {
	word, token,
	website, invite,
	mention, message,
	limit, timeout,
	punishment, ignore_role,
	ignore_channel, ignore_user,
}
export default AutoModPart;

export type AutoModListPart = AutoModPart.word | AutoModPart.token | AutoModPart.website | AutoModPart.invite | AutoModPart.ignore_role | AutoModPart.ignore_channel | AutoModPart.ignore_user;
export type AutoModAntiSpamPart = AutoModPart.message | AutoModPart.mention;

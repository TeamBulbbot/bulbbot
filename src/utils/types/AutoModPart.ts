enum AutoModPart {
	word, token,
	website, invite,
	mentions, messages,
}
export default AutoModPart;

export type AutoModListPart = AutoModPart.word | AutoModPart.token | AutoModPart.website | AutoModPart.invite;
export type AutoModSpamPart = AutoModPart.messages | AutoModPart.mentions;

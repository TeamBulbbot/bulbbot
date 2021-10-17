enum LoggingPart {
	member,
	role,
	other,
	message,
	channel,
	invite,
	automod,
	modAction,
	joinLeave,
	thread,
	banpool,
}
export default LoggingPart;
export type LoggingPartString = keyof typeof LoggingPart;

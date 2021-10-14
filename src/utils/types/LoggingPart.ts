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
}
export default LoggingPart;
export type LoggingPartString = "message" | "member" | "role" | "channel" | "thread" | "invite" | "joinLeave" | "automod" | "modAction" | "banpool" | "other";

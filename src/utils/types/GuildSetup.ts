import AutoModSetup from "./AutoModSetup";
import LoggingSetup from "./LoggingSetup";

export default interface GuildSetup {
	language?: string;
	prefix?: string;
	timezone?: string;
	muterole?: string | null;
	automod?: string;
	automod_settings?: AutoModSetup;
	logging?: string;
	logging_settings?: LoggingSetup;
	autorole?: string | null;
}

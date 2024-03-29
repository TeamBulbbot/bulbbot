import AutoModSetup from "./AutoModSetup";
import LoggingSetup from "./LoggingSetup";

export default interface GuildSetup {
	language?: string;
	timezone?: string;
	automod?: string;
	automod_settings?: AutoModSetup;
	logging?: string;
	logging_settings?: LoggingSetup;
	autorole?: string | null;
}

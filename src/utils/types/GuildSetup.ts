import AutoModConfiguration from "./AutoModConfiguration";
import LoggingConfiguration from "./LoggingConfiguration";

export default interface GuildSetup {
	language?: string;
	prefix?: string;
	timezone?: string;
	muterole?: string | null;
	automod?: string;
	automod_settings?: AutoModConfiguration;
	logging?: string;
	logging_settings?: LoggingConfiguration;
	autorole?: string | null;
}

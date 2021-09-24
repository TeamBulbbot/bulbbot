import AutoModSetup from "./AutoModSetup";
import LoggingSetup from "./LoggingSetup";
import GuildSetup from "./GuildSetup"

export default interface SetupData {
    automod?: string;
	automod_settings?: AutoModSetup;
    guild?: string;
    guild_settings?: GuildSetup;
	logging?: string;
	logging_settings?: LoggingSetup;
}

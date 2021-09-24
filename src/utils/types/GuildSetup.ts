export default interface GuildSetup {
	language?: string;
	prefix?: string;
	timezone?: string;
	muteRole?: string | null; // Snowflake
	autorole?: string | null; // Snowflake
	actionsOnInfo?: boolean;
	rolesOnLeave?: boolean;
}

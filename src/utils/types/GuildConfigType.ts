export default interface GuildConfigType {
	id: number;
	prefix: string;
	language: string;
	timezone: string;
	premiumGuild: boolean;
	muteRole: string | null; // Snowflake
	autorole: string | null; // Snowflake
	actionsOnInfo: boolean;
	rolesOnLeave: boolean;
	createdAt: string;
	updatedAt: string;
}

import { Snowflake } from "discord.js";

export interface GuildConfiguration {
	prefix: string;
	language: string;
	timezone: string;
	muteRole: Snowflake;
	premiumGuild: boolean;
	autorole: Snowflake;
	actionsOnInfo: boolean;
	rolesOnLeave: boolean;
	quickReasons: string[];
}
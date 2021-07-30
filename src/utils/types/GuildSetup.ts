export default interface GuildSetup {
	language?: string,
	prefix?: string,
	timezone?: string,
	muterole?: string | null,
	automod?: string,
	automod_settings?: {

	},
	logging?: string,
	logging_settings?: {

	}
	autorole?: string | null,
}

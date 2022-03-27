type LocalCode =
	| "da"
	| "de"
	| "en-GB"
	| "en-US"
	| "es-ES"
	| "fr"
	| "hr"
	| "it"
	| "lt"
	| "hu"
	| "nl"
	| "no"
	| "pl"
	| "pt-BR "
	| "ro"
	| "fi"
	| "sv-SE"
	| "vi"
	| "tr"
	| "cs"
	| "el"
	| "bg"
	| "ru"
	| "uk"
	| "hi"
	| "th"
	| "zh-CN"
	| "ja"
	| "zh-TW"
	| "ko";

type Localization = { [key in LocalCode]?: string };

export enum ApplicationCommandType {
	CHAT_INPUT = 1,
	USER = 2,
	MESSAGE = 3,
}

export enum ApplicationCommandOptionTypes {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
}

export enum ApplicationCommandOptionsChannelTypes {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4,
	GUILD_NEWS = 5,
	GUILD_STORE = 6,
	GUILD_NEWS_THREAD = 10,
	GUILD_PUBLIC_THREAD = 11,
	GUILD_PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE = 13,
}

interface ApplicationCommandOptionChoices {
	name: string;
	value: string | number;
}

interface ApplicationCommandOptions {
	type: ApplicationCommandOptionTypes;
	name: string;
	description: string;
	required?: boolean;
	choices?: ApplicationCommandOptionChoices[];
	options?: ApplicationCommandOptions[];
	channel_types?: ApplicationCommandOptionsChannelTypes[];
	min_value?: number;
	max_value?: number;
	autocomplete?: boolean;
	name_localizations?: Localization;
	description_localizations?: Localization;
}

export interface ApplicationCommand {
	name: string;
	description: string;
	options?: ApplicationCommandOptions[];
	default_permission?: boolean;
	type?: ApplicationCommandType;
	name_localizations?: Localization;
	description_localizations?: Localization;
}

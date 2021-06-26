export const NonDigits: RegExp = /\D/g;

export const UserMention: RegExp = /<@!?(\d{17,20})>/g;
export const UserMentionAndID: RegExp = /(\d{17,20})|<@!?(\d{17,20})>/g;
export const RoleMention: RegExp = /<@&(\d+)>/g;
export const ChannelMention: RegExp = /<#(\d+)>/g;
export const EveryoneHereMention: RegExp = /@everyone|@here/g;
export const Emoji: RegExp = /(\p{ExtPict}(?:\p{EComp}(?:\p{ExtPict}|\p{EMod}|\p{EBase}))*\p{EComp}?|\d\u{FE0F}\u{20E3}|[\u{1F1E6}-\u{1F1FF}][\u{1F1E6}-\u{1F1FF}]?)/gu; // Matches all Unicode emoji, shouldn't match anything else
export const CustomEmote: RegExp = /<(?:a)?:([a-zA-Z0-9_]{2,32}):(\d{17,})>/g; // Matches custom emotes
export const GetEverythingAfterColon: RegExp = /(?<=\:)[^:]*$/;
export const ReasonImage: RegExp = /((?:https?:\/\/)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/[^ \n<>]*)\.(?:png|apng|jpg|gif))/g;
export const QuoteMarked: RegExp = /"(.*?)"/;

export const AutoMod_INVITE: RegExp = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.me|(?:app)?)?\/(invite\/)?(?!(partners|verification|download))([A-z0-9-_]+)/gi; ///(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.me|(?:app)?\.com\/invite)\/([A-Za-z0-9-]+)/g;
export const AutoMod_WEBSITE: RegExp = /(?:https:\/\/)?(www\.)?((?:[A-z0-9]+\.){1,128}[A-z0-9]{2,64})/gi ///(?:https?:\/\/)?(}(?:[A-Za-z0-9]+\.){1,128}(?:[A-Za-z0-9]{2,63})(?:\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;%=-]*)?)/g;

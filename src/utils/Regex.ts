export const NonDigits = /\D/g;

export const AnyId = /[0-9]{17,20}/g;
export const UserMention = /<@!?(\d{17,20})>/g;
export const ChannelMessage = /[0-9]{17,20}-[0-9]{17,20}/gi;
export const UserMentionAndID = /(\d{17,20})|<@!?(\d{17,20})>/g;
export const RoleMentionAndID = /(\d{17,20})|<@&?(\d{17,20})>/g;
export const RoleMention = /<@&(\d+)>/g;
export const ChannelMention = /<#(\d+)>/g;
export const EveryoneHereMention = /@everyone|@here/g;
export const Emoji = /(\p{ExtPict}(?:\p{EComp}(?:\p{ExtPict}|\p{EMod}|\p{EBase}))*\p{EComp}?|\d\u{FE0F}\u{20E3}|[\u{1F1E6}-\u{1F1FF}][\u{1F1E6}-\u{1F1FF}]?)/gu; // Matches all Unicode emoji, shouldn't match anything else
export const CustomEmote = /<(?:a)?:([a-zA-Z0-9_]{2,32}):(\d{17,})>/g; // Matches custom emotes
export const GetEverythingAfterColon = /(?<=\:)[^:]*$/;
export const ReasonImage = /((?:https?:\/\/)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/[^ \n<>]*)\.(?:png|apng|jpg|gif))/g;
export const QuoteMarked = /"(.*?)"/;

export const AutoMod_INVITE = /(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.me|(?:app)?|.com\/invite)?\/([A-z0-9-_]{1,25})/gi; ///(?:https?:\/\/)?(?:www\.)?discord(?:\.gg|\.me|(?:app)?\.com\/invite)\/([A-Za-z0-9-]+)/g;
export const AutoMod_WEBSITE = /(?:https:\/\/)?(www\.)?((?:[A-z0-9]+\.){1,128}[A-z0-9]{2,64})/gi; ///(?:https?:\/\/)?(}(?:[A-Za-z0-9]+\.){1,128}(?:[A-Za-z0-9]{2,63})(?:\/[A-Za-z0-9._~:/?#\[\]@!$&'()*+,;%=-]*)?)/g;

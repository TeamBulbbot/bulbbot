exports.NonDigits = /\D/g;

exports.UserMention = /<@?!?[0-9>]+/g;
exports.UserMentionStrict = /<@?!?[0-9>]+|[0-9>]{17,}/g;
exports.RoleMention = /<@&[0-9>]+/g;
exports.EveryoneHereMention = /@everyone|@here+/g;
exports.Emote = /:[0-9>]{17,}>+/g;
exports.ReasonImage = /((?:https?:\/\/)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/[^ \n<>]*)\.(?:png|apng|jpg|gif))/g;

exports.AutoMod_INVITE = /(http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([A-Za-z0-9])+/g;
exports.AutoMod_WEBSITE = /(https:\/\/|http:\/\/)?(www\.)?([A-z0-9]{1,10}\.){1,10}([A-z0-9]{1,10})(\/)?/g
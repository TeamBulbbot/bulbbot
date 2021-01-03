exports.NonDigits = /\D/g;

exports.UserMention = /<@?!?[0-9>]+/g;
exports.UserMentionStrict = /<@?!?[0-9>]+|[0-9>]{17,}/g;
exports.RoleMention = /<@&[0-9>]+/g;
exports.EveryoneHereMention = /@everyone|@here+/g;
exports.Emote = /:[0-9>]{17,}>+/g;
exports.ReasonImage = /((?:https?:\/\/)[a-z0-9]+(?:[-.][a-z0-9]+)*\.[a-z]{2,5}(?::[0-9]{1,5})?(?:\/[^ \n<>]*)\.(?:png|apng|jpg|gif))/g;

exports.NonDigits = /\D/g;

exports.UserMention = /<@?!?[0-9>]+/g;
exports.UserMentionStrict = /<@?!?[0-9>]+|[0-9>]{17,}/g;
exports.RoleMention = /<@&[0-9>]+/g;
exports.EveryoneHereMention = /@everyone|@here+/g;

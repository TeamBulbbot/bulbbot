const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args);
	}

	run(reaction, user) {
		console.log(reaction);
		console.log(user);
	}
};

/*
message.channel.name
<# message.channel.id >
message.channel.nsfw (true return)

message.content
message.author.tag
message.author.id

message._emoji.name
message._emoji.id

message.count

*/

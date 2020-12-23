const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldChannel, newChannel) {
		// TODO
		/*
		channel.type
		channel.id
		channel.name
		*/

		// Check for name change
		// If you are bored one day check for perm changes

		console.log("old channel:", oldChannel);
		console.log("new channel:", newChannel);
	}
};

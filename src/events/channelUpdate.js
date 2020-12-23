const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldChannel, newChannel) {
		// TODO
		console.log("old channel:", oldChannel);
		console.log("new channel:", newChannel);
	}
};

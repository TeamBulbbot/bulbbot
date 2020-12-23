const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldMessage, newMessage) {
		// TODO
		console.log("old message:", oldMessage);
		console.log("new message:", newMessage);
	}
};

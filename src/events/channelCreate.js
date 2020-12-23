const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(channel) {
		// TODO
		console.log("channel created:", channel);
	}
};

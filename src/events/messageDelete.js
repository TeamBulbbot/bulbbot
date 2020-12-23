const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(message) {
		// TODO
		console.log("message deleted:", message);
	}
};

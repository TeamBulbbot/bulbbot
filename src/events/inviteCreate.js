const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(invite) {
		// TODO
		console.log("invite created:", invite);
	}
};

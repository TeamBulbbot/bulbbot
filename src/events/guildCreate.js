const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(guild) {
		// TODO
		console.log("join guild:", guild);
	}
};

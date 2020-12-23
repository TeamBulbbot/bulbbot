const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(guild, user) {
		// TODO
		console.log("new ban in:", guild);
		console.log("user:", user);
	}
};

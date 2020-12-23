const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(member) {
		// TODO
		console.log("new guild member:", member);
	}
};

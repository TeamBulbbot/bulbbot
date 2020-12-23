const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(role) {
		// TODO
		console.log("new role:", role);
	}
};

const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldMember, newMember) {
		// TODO
		console.log("old member:", oldMember);
		console.log("new member:", newMember);
	}
};

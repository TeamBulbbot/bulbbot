const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(invite) {
		// TODO
		// log somewhere
		return;
		console.log(`Invite deleted: \`${invite.code}\``);
	}
};

const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(info) {
		console.info("[CLIENT RATELIMIT]: ", info);
	}
};

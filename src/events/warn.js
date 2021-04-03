const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(info) {
		console.warn("[CLIENT WARN]: ", info);
	}
};

const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(info) {
		if (process.env.ENVIRONMENT === "prod") console.info("[CLIENT DEBUG]: ", info);
	}
};

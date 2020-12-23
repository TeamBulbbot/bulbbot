const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(channel) {
		// TODO
		/*
		channel.type
		channel.id
		channel.name
		*/
		console.log("channel deleted:", channel);
	}
};

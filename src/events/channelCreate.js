const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(channel) {
		// TODO
		// log somewhere
		console.log(`Chanel created: <#${channel.id}> (${channel.type})`);
	}
};

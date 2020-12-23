const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(guild) {
		// TODO
		/*
		guild.id
		guild.name
		*/

		// add guild to the database
		console.log("join guild:", guild);
	}
};

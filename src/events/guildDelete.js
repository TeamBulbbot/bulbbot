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
		*/

		// remove the guild from the database

		console.log("removed from guild:", guild);
	}
};

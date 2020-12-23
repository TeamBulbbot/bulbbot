const Event = require("../structures/Event");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(oldGuild, newGuild) {
		// TODO
		console.log("old guild:", oldGuild);
		console.log("new guild:", newGuild);
	}
};

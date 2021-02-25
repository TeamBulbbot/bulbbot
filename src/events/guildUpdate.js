const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(oldGuild, newGuild) {
		// TODO
		return;
		console.log("old guild:", oldGuild);
		console.log("new guild:", newGuild);
	}
};

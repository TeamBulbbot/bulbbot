const Event = require("../structures/Event");
const AutoMod = require("../utils/AutoMod");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMessage, newMessage) {
		await AutoMod.Master(newMessage)
	}
};

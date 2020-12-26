const Event = require("../structures/Event");
const CreateGuild = require("../utils/guilds/CreateGuild");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild) {
		await CreateGuild(guild);
	}
};

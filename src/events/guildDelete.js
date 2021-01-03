const Event = require("../structures/Event");
const DeleteGuild = require("../utils/guilds/DeleteGuild");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild) {
		await DeleteGuild(guild.id);
	}
};

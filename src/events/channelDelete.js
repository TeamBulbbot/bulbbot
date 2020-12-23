const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(channel) {
		SendEventLog(this.client, channel.guild, "channel", `**Channel deleted:** <#${channel.id}> (${channel.type})`);
	}
};

const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(channel) {
		SendEventLog(
			this.client,
			channel.guild,
			"channel",
			this.client.bulbutils.translate("event_channel_create", {
				channel_id: channel.id,
				channel_type: channel.type,
			}),
		);
	}
};

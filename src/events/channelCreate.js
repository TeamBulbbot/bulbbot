const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(channel) {
		if (channel === undefined) return;

		SendEventLog(
			this.client,
			channel.guild,
			"channel",
			await this.client.bulbutils.translate("event_channel_create", channel.guild.id, {
				channel_id: channel.id,
				channel_type: channel.type,
			}),
		);
	}
};

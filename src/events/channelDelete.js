const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(channel) {
		SendEventLog(
			this.client,
			channel.guild,
			"channel",
			await this.client.bulbutils.translate("event_channel_delete", channel.guild.id, {
				channel_name: channel.name,
				channel_id: channel.id,
				channel_type: channel.type,
			}),
		);
	}
};

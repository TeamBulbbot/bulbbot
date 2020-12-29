const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(oldChannel, newChannel) {
		let msg = "**Channel update:** ";

		// name change
		if (oldChannel.name !== newChannel.name) {
			msg += this.client.bulbutils.translate("event_channel_update_name", {
				channel_id: newChannel.id,
				oldchannel_name: oldChannel.name,
				newchannel_name: newChannel.name,
			});
		}

		// topic added
		if (oldChannel.topic === null && newChannel.topic !== null) {
			msg += this.client.bulbutils.translate("event_channel_update_topic_added", {
				channel_id: newChannel.id,
				channel_topic: newChannel.topic,
			});
		}

		// topic removed
		if (newChannel.topic === null && oldChannel.topic !== null) {
			msg += this.client.bulbutils.translate("event_channel_update_topic_removed", {
				channel_id: newChannel.id,
			});
		}

		// topic update
		if (newChannel.topic !== null && oldChannel.topic !== null && newChannel.topic !== oldChannel.topic) {
			msg += this.client.bulbutils.translate("event_channel_update_topic_updated", {
				channel_id: newChannel.id,
				oldchannel_topic: oldChannel.topic,
				newchannel_topic: newChannel.topic,
			});
		}

		// type change
		if (oldChannel.type !== newChannel.type) {
			msg += this.client.bulbutils.translate("event_channel_update_type", {
				channel_id: newChannel.id,
				oldchannel_type: oldChannel.type,
				newchannel_type: newChannel.type,
			});
		}
		//  nsw change
		if (oldChannel.nsfw !== newChannel.nsfw) {
			if (newChannel.nsfw) {
				msg += this.client.bulbutils.translate("event_channel_update_nsfw_enabled", {
					channel_id: newChannel.id,
				});
			} else {
				msg += this.client.bulbutils.translate("event_channel_update_nsfw_disabled", {
					channel_id: newChannel.id,
				});
			}
		}

		if (msg !== "**Channel update:** ") SendEventLog(this.client, newChannel.guild, "channel", msg);
	}
};

/*
// was moved (a bit spam)
if (oldChannel.rawPosition !== newChannel.rawPosition)
	console.log(`Chanel update in <#${newChannel.id}> position was moved from \`${oldChannel.rawPosition}\` to \`${newChannel.rawPosition}\``);
*/

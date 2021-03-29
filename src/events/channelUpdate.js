const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldChannel, newChannel) {
		let msg = "**Channel update:** ";

		// name change
		if (oldChannel.name !== newChannel.name) {
			msg += await this.client.bulbutils.translate("event_channel_update_name", newChannel.guild.id, {
				channel_id: newChannel.id,
				oldchannel_name: oldChannel.name,
				newchannel_name: newChannel.name,
			});
		}

		// topic added
		if (oldChannel.topic === null && newChannel.topic !== null) {
			msg += await this.client.bulbutils.translate("event_channel_update_topic_added", newChannel.guild.id, {
				channel_id: newChannel.id,
				channel_topic: newChannel.topic,
			});
		}

		// topic removed
		if (newChannel.topic === null && oldChannel.topic !== null) {
			msg += await this.client.bulbutils.translate("event_channel_update_topic_removed", newChannel.guild.id, {
				channel_id: newChannel.id,
			});
		}

		// topic update
		if (newChannel.topic !== null && oldChannel.topic !== null && newChannel.topic !== oldChannel.topic) {
			msg += await this.client.bulbutils.translate("event_channel_update_topic_updated", newChannel.guild.id, {
				channel_id: newChannel.id,
				oldchannel_topic: oldChannel.topic,
				newchannel_topic: newChannel.topic,
			});
		}

		// type change
		if (oldChannel.type !== newChannel.type) {
			msg += await this.client.bulbutils.translate("event_channel_update_type", newChannel.guild.id, {
				channel_id: newChannel.id,
				oldchannel_type: oldChannel.type,
				newchannel_type: newChannel.type,
			});
		}
		//  nsw change
		if (oldChannel.nsfw !== newChannel.nsfw) {
			if (newChannel.nsfw) {
				msg += await this.client.bulbutils.translate("event_channel_update_nsfw_enabled", newChannel.guild.id, {
					channel_id: newChannel.id,
				});
			} else {
				msg += await this.client.bulbutils.translate("event_channel_update_nsfw_disabled", newChannel.guild.id, {
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

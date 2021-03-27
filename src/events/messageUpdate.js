const Event = require("../structures/Event");
const AutoMod = require("../utils/AutoMod");
const { SendEventLog } = require("../utils/moderation/log");
const { Util } = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMessage, newMessage) {
		if (newMessage.author.id === this.client.user.id) return;
		if (oldMessage.content === newMessage.content) return;
		await AutoMod.Master(newMessage);

		let msg = await this.client.bulbutils.translate("event_message_edit", {
			target_tag: newMessage.author.tag,
			target_id: newMessage.author.id,
			channel_id: newMessage.channel.id,
			after_channel_id: newMessage.channel.id,
			after_id: newMessage.id,
			before: oldMessage.content,
			after: newMessage.content,
		});

		if (msg.length >= 2000) {
			await SendEventLog(this.client, newMessage.guild, "message", msg.substring(0, 1500));
			await SendEventLog(this.client, newMessage.guild, "message", msg.substring(1500, msg.length));
		} else await SendEventLog(this.client, newMessage.guild, "message", msg);
	}
};

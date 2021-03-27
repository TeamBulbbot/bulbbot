const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");
const { Util } = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(message) {
		if (message.author.id === this.client.user.id) return;

		let msg = await this.client.bulbutils.translate("event_message_delete", {
			target_tag: message.author.tag,
			target_id: message.author.id,
			channel_id: message.channel.id,
			after_channel_id: message.channel.id,
			after_id: message.id,
			content: message.content ? Util.cleanContent(message.content, message) : "",
			attachment: message.attachments.first() ? message.attachments.first().proxyURL : "None",
			embed: message.embeds.length !== 0 ? "[Embed]" : "None"
		});

		if (msg.length >= 2000) {
			await SendEventLog(this.client, message.guild, "message", msg.substring(0, 1500));
			await SendEventLog(this.client, message.guild, "message", msg.substring(1500, msg.length));
		} else await SendEventLog(this.client, message.guild, "message", msg);
	}
};

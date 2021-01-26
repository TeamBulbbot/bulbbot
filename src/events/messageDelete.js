const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(message) {
		if (message.author.id === this.client.user.id) return;

		let msg = `Message from **${message.author.tag}** \`${message.author.id}\` was deleted in <#${message.channel.id}>\n\`Id (channel-message): ${message.channel.id}-${message.id}\`\n`;

		if (message.attachments.first()) msg += `**A:** ${message.attachments.first().proxyURL}\n`;
		if (message.content) msg += `**C:** ${message.content}`;

		if (msg.length >= 2000) {
			SendEventLog(this.client, message.guild, "message", msg.substring(0, 1500));
			SendEventLog(this.client, message.guild, "message", msg.substring(1500, msg.length));
		} else SendEventLog(this.client, message.guild, "message", msg);
	}
};

const Event = require("../structures/Event");
const AutoMod = require("../utils/AutoMod");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMessage, newMessage) {
		if (newMessage.author.id === this.client.user.id) return;
		await AutoMod.Master(newMessage);

		let msg = `Message from **${newMessage.author.tag}** \`${newMessage.author.id}\` was updated in <#${newMessage.channel.id}>\n\`Id (channel-message): ${newMessage.channel.id}-${newMessage.id}\`\n`;
		if (oldMessage.content) msg += `**B:** ${oldMessage.content}\n`;
		if (newMessage.content) msg += `**A:** ${newMessage.content}`;

		if (msg.length >= 2000) {
			SendEventLog(this.client, newMessage.guild, "message", msg.substring(0, 1500));
			SendEventLog(this.client, newMessage.guild, "message", msg.substring(1500, msg.length));
		} else SendEventLog(this.client, newMessage.guild, "message", msg);
	}
};

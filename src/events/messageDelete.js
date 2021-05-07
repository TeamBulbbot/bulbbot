const Event = require("../structures/Event");
const { SendEventLog, SendEventLogFile } = require("../utils/moderation/log");
const { Util } = require("discord.js");
const fs = require("fs");
const moment = require("moment");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(message) {
		if (message.author.id === this.client.user.id) return;

		let msg = await this.client.bulbutils.translate("event_message_delete", message.guild.id, {
			target_tag: message.author.bot ? `${message.author.tag} :robot:` : message.author.tag,
			target_id: message.author.id,
			channel_id: message.channel.id,
			after_channel_id: message.channel.id,
			after_id: message.id,
			time: `[${this.client.bulbutils.formatSmall(message.createdTimestamp)}]`,
			content: message.content ? `**C:** ${Util.cleanContent(message.content, message)}` : "",
			attachment: message.attachments.first() ? `**A**: ${message.attachments.first().proxyURL}` : "",
			embed: message.embeds.length !== 0 ? "**E:** [Embed]" : "",
		});

		if (msg.length >= 1850) {
			fs.writeFile(`./src/files/events/MESSAGE_DELETE-${message.guild.id}.txt`, msg, function (err) {
				if (err) console.error(err);
			});
			await SendEventLogFile(this.client, message.guild, "message", "", `./src/files/events/MESSAGE_DELETE-${message.guild.id}.txt`);
		} else await SendEventLog(this.client, message.guild, "message", msg);
	}
};

const Event = require("../structures/Event");
const AutoMod = require("../utils/AutoMod");
const { SendEventLog, SendEventLogFile } = require("../utils/moderation/log");
const { Util } = require("discord.js");
const fs = require("fs");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMessage, newMessage) {
		if (newMessage.author.id === this.client.user.id) return;
		if (oldMessage.content === newMessage.content) return;
		await AutoMod.Master(newMessage);

		let msg = await this.client.bulbutils.translate("event_message_edit", newMessage.guild.id, {
			target_tag: newMessage.author.bot ? `${newMessage.author.tag} :robot:` : newMessage.author.tag,
			target_id: newMessage.author.id,
			channel_id: newMessage.channel.id,
			after_channel_id: newMessage.channel.id,
			after_id: newMessage.id,
			time: `[${this.client.bulbutils.formatSmall(newMessage.editedTimestamp)}]`,
			before: Util.cleanContent(oldMessage.content, oldMessage),
			after: Util.cleanContent(newMessage.content, newMessage),
		});

		if (msg.length >= 1850) {
			fs.writeFile(`./src/files/events/MESSAGE_UPDATE-${newMessage.guild.id}.txt`, msg, async function (err) {
				if (err) console.error(err);
			});

			await SendEventLogFile(this.client, newMessage.guild, "message", "", `./src/files/events/MESSAGE_UPDATE-${newMessage.guild.id}.txt`);
		} else await SendEventLog(this.client, newMessage.guild, "message", msg);
	}
};

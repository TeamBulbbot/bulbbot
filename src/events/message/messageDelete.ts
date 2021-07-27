import Event from "../../structures/Event";
import { Message, Util } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<void> {
		if (message.author.id === this.client.user!.id) return;
		if (!message.guild) return;

		const msg: string = await this.client.bulbutils.translate("event_message_delete", message.guild.id, {
			target_tag: message.author.bot ? `${message.author.tag} :robot:` : message.author.tag,
			target_id: message.author.id,
			channel_id: message.channel.id,
			after_channel_id: message.channel.id,
			after_id: message.id,
			time: `[${this.client.bulbutils.formatSmall(message.createdTimestamp)}]`,
			content: message.content ? `**C:** ${Util.cleanContent(message.content, message)}` : "",
			attachment: message.attachments.first() ? `**A**: ${message.attachments.first()?.proxyURL}` : "",
			embed: message.embeds.length !== 0 ? "**E:** [Embed]" : "",
		});

		if (msg.length >= 1850) {
			fs.writeFileSync(`./files/events/MESSAGE-DELETE-${message.guild.id}.txt`, message.content);
			await loggingManager.sendEventLogFile(
				this.client,
				message.guild,
				"message",
				await this.client.bulbutils.translate("event_message_delete_special", message.guild.id, {
					target_tag: message.author.bot ? `${message.author.tag} :robot:` : message.author.tag,
					target_id: message.author.id,
					channel_id: message.channel.id,
					after_channel_id: message.channel.id,
					after_id: message.id,
					time: `[${this.client.bulbutils.formatSmall(message.createdTimestamp)}]`,
				}),
				`./files/events/MESSAGE-DELETE-${message.guild.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, message.guild, "message", msg);
	}
}

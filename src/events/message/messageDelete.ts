import Event from "../../structures/Event";
import { Message, Util } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<void> {
		if (message.author.id === this.client.user!.id) return;
		if (!message.guild) return;

		const msg: string = await this.client.bulbutils.translate("event_message_delete", message.guild.id, {
			user_tag: message.author.bot ? `${message.author.tag} :robot:` : message.author.tag,
			user: message.author,
			message,
			channel: message.channel,
			content: message.content ? `**C:** ${Util.cleanContent(message.content, message.channel)}\n` : "",
			reply: message.type === "REPLY" ? `**Reply to:** https://discord.com/channels/${message.reference?.guildId}/${message.reference?.channelId}/${message.reference?.messageId}\n` : "",
			sticker: message.stickers.first() ? `**S:** ID: \`${message.stickers.first()?.id}\` | **Name:** ${message.stickers.first()?.name} | **Format:** ${message.stickers.first()?.format}\n` : "",
			attachment: message.attachments.first() ? `**A**: ${message.attachments.first()?.proxyURL}\n` : "",
		});

		if (msg.length >= 1850) {
			fs.writeFileSync(`${__dirname}/../../../files/MESSAGE_DELETE-${message.guild?.id}.txt`, message.content);
			await loggingManager.sendEventLogFile(
				this.client,
				message.guild,
				"message",
				await this.client.bulbutils.translate("event_message_delete_special", message.guild.id, {
					user_tag: message.author.bot ? `${message.author.tag} :robot:` : message.author.tag,
					user: message.author,
					message,
				}),
				`${__dirname}/../../../files/MESSAGE_DELETE-${message.guild?.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, message.guild, "message", msg, message.embeds.length !== 0 ? message.embeds : null);
	}
}

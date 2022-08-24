import Event from "../../structures/Event";
import { Message, Util } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import { writeFile } from "fs/promises";
import AutoMod from "../../utils/AutoMod";
import prisma from "../../prisma";
import { filesDir } from "../..";

const loggingManager: LoggingManager = new LoggingManager();
export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(oldMessage: Message, newMessage: Message): Promise<void> {
		if (newMessage.partial) {
			newMessage = await newMessage.fetch(true);
		}

		if (!newMessage.guild) return;

		let oldMessageContent: string;

		if (oldMessage.partial || newMessage.partial) {
			const dbData = await prisma.messageLog.findUnique({
				where: {
					messageId: oldMessage.id,
				},
			});
			if (!dbData?.content) return;
			oldMessageContent = dbData.content;
		} else {
			if (newMessage.author?.id === this.client.user?.id) return;
			if (oldMessage.content === newMessage.content) return;

			await AutoMod(this.client, newMessage);

			oldMessageContent = oldMessage.content;
		}

		const msg: string = await this.client.bulbutils.translate("event_message_edit", newMessage.guild.id, {
			user_tag: newMessage.author?.bot ? `${newMessage.author?.tag} :robot:` : newMessage.author?.tag,
			user: newMessage.author,
			message: newMessage,
			channel: newMessage.channel,
			before: Util.cleanContent(oldMessageContent, oldMessage.channel),
			after: Util.cleanContent(newMessage.content, newMessage.channel),
		});

		if (msg.length >= 1850) {
			await writeFile(`${filesDir}/MESSAGE_UPDATE-${newMessage.guild.id}.txt`, `**B:** ${oldMessageContent}\n**A:** ${newMessage.content}`);
			await loggingManager.sendEventLog(
				this.client,
				newMessage.guild,
				"message",
				await this.client.bulbutils.translate("event_message_edit_special", newMessage.guild.id, {
					user_tag: newMessage.author?.bot ? `${newMessage.author?.tag} :robot:` : newMessage.author?.tag,
					user: newMessage.author,
					message: newMessage,
					channel: newMessage.channel,
				}),
				`${filesDir}/MESSAGE_UPDATE-${newMessage.guild.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, newMessage.guild, "message", msg);

		await prisma.messageLog.update({
			data: {
				content: newMessage.content,
			},
			where: {
				messageId: oldMessage.id,
			},
		});
	}
}

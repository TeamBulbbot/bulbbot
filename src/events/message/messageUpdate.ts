import Event from "../../structures/Event";
import { Message, Util } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import CommandContext, { getCommandContext } from "../../structures/CommandContext";
import AutoMod from "../../utils/AutoMod";

const loggingManager: LoggingManager = new LoggingManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(oldMessage: Message, newMessage: Message): Promise<void> {
		if (!newMessage.guild) return;

		if (oldMessage.partial) {
			console.log(oldMessage, newMessage);
		} else {
			if (newMessage.author.id === this.client.user!.id) return;
			if (oldMessage.content === newMessage.content) return;

			const context: CommandContext = await getCommandContext(newMessage);
			const clearance = await clearanceManager.getUserClearance(context);

			if (clearance < 25) await AutoMod(this.client, context);

			const msg: string = await this.client.bulbutils.translate("event_message_edit", newMessage.guild.id, {
				user_tag: newMessage.author.bot ? `${newMessage.author.tag} :robot:` : newMessage.author.tag,
				user: newMessage.author,
				message: newMessage,
				channel: newMessage.channel,
				before: Util.cleanContent(oldMessage.content, oldMessage.channel),
				after: Util.cleanContent(newMessage.content, newMessage.channel),
			});

			if (msg.length >= 1850) {
				fs.writeFileSync(`${__dirname}/../../../files/MESSAGE_UPDATE-${newMessage.guild?.id}.txt`, `**B:** ${oldMessage.content}\n**A:** ${newMessage.content}`);
				await loggingManager.sendEventLog(
					this.client,
					newMessage.guild,
					"message",
					await this.client.bulbutils.translate("event_message_edit_special", newMessage.guild.id, {
						user_tag: newMessage.author.bot ? `${newMessage.author.tag} :robot:` : newMessage.author.tag,
						user: newMessage.author,
						message: newMessage,
						channel: newMessage.channel,
					}),
					`${__dirname}/../../../files/MESSAGE_UPDATE-${newMessage.guild?.id}.txt`,
				);
			} else await loggingManager.sendEventLog(this.client, newMessage.guild, "message", msg);
		}
	}
}

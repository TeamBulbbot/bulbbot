import Event from "../../structures/Event";
import { Message, Util, Permissions, GuildAuditLogs, MessageAttachment, Guild, GuildChannelManager, TextBasedChannels } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { User } from "@sentry/node";

const loggingManager: LoggingManager = new LoggingManager();
const { getMessageFromDB, deleteMessageFromDB }: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<void> {
		if (!message.guild) return;
		let msg: string = "";
		let channel: TextBasedChannels;
		let guild: Guild;
		let author: User;
		let content: string;

		if (message.partial) {
			const dbData = await getMessageFromDB(message.id);
			if (dbData === undefined) return;
			author = (await this.client.bulbfetch.getUser(dbData.authorId)) as User;
			channel = (await this.client.bulbfetch.getChannel(this.client.channels as GuildChannelManager, dbData.channelId)) as TextBasedChannels;
			guild = this.client.guilds.cache.get(dbData.guildId) as Guild;
			content = dbData.content;
		} else {
			if (message.author.id === this.client.user!.id) return;
			author = message.author;
			channel = message.channel as TextBasedChannels;
			guild = message.guild;
			content = message.content;

			if (guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
				const logs: GuildAuditLogs = await guild.fetchAuditLogs({ limit: 1, type: "MESSAGE_DELETE" });
				const first = logs.entries.first();
				if (first) {
					const { executor, createdTimestamp } = first;
					if (Date.now() < createdTimestamp + 3000)
						msg = await this.client.bulbutils.translate("event_message_delete_moderator", guild.id, {
							user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
							user: author,
							moderator: executor,
							message,
							channel,
							content: content ? `**C:** ${Util.cleanContent(content, channel)}\n` : "",
							reply: message.type === "REPLY" ? `**Reply to:** https://discord.com/channels/${message.reference?.guildId}/${message.reference?.channelId}/${message.reference?.messageId}\n` : "",
							sticker: message.stickers.first()
								? `**S:** ID: \`${message.stickers.first()?.id}\` | **Name:** ${message.stickers.first()?.name} | **Format:** ${message.stickers.first()?.format}\n`
								: "",
							attachment: message.attachments.first() // @ts-ignore
								? `**A**: ${message.attachments.map((attach: MessageAttachment) => `**${attach.name}**\n${message.channel.nsfw ? `|| ${attach.proxyURL} ||` : attach.proxyURL}`).join("\n")}\n`
								: "",
						});
				}
			}
		}

		if (!msg)
			msg = await this.client.bulbutils.translate("event_message_delete", guild.id, {
				user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
				user: author,
				message,
				channel,
				content: content ? `**C:** ${Util.cleanContent(content, channel)}\n` : "",
				reply: message.type === "REPLY" ? `**Reply to:** https://discord.com/channels/${message.reference?.guildId}/${message.reference?.channelId}/${message.reference?.messageId}\n` : "",
				sticker: message.stickers.first() ? `**S:** ID: \`${message.stickers.first()?.id}\` | **Name:** ${message.stickers.first()?.name} | **Format:** ${message.stickers.first()?.format}\n` : "",
				attachment: message.attachments.first() // @ts-ignore
					? `**A**: ${message.attachments.map((attach: MessageAttachment) => `**${attach.name}**\n${message.channel.nsfw ? `|| ${attach.proxyURL} ||` : attach.proxyURL}`).join("\n")}\n`
					: "",
			});

		if (msg.length >= 1850) {
			fs.writeFileSync(`${__dirname}/../../../files/MESSAGE_DELETE-${guild?.id}.txt`, content);
			await loggingManager.sendEventLog(
				this.client,
				guild,
				"message",
				await this.client.bulbutils.translate("event_message_delete_special", guild.id, {
					user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
					user: author,
					message,
					channel,
				}),
				`${__dirname}/../../../files/MESSAGE_DELETE-${guild?.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, guild, "message", msg, message.embeds.length !== 0 ? message.embeds : null);

		await deleteMessageFromDB(message.id);
	}
}

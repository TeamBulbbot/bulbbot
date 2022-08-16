import Event from "../../structures/Event";
import { Message, Util, Permissions, GuildAuditLogs, MessageAttachment, Guild, GuildChannelManager, TextBasedChannel, MessageEmbed } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as fs from "fs";
import { User } from "@sentry/node";
import prisma from "../../prisma";
import { isNullish } from "../../utils/helpers";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<void> {
		if (!message.guild) return;
		let msg = "";
		let channel: TextBasedChannel;
		let guild: Guild;
		let author: User;
		let content: string;
		let sticker: string;
		let attachment: string;
		let embeds: string | MessageEmbed[] | null;

		if (message.partial) {
			const dbData = await prisma.messageLog.findUnique({
				where: {
					messageId: message.id,
				},
			});
			if (isNullish(dbData)) return;
			// @ts-expect-error
			author = await this.client.bulbfetch.getUser(dbData.authorId);
			// @ts-expect-error
			channel = await this.client.bulbfetch.getChannel(this.client.channels as GuildChannelManager, dbData.channelId);
			// @ts-expect-error
			guild = this.client.guilds.cache.get(channel.guild?.id);
			// @ts-expect-error
			content = dbData.content;
			// @ts-expect-error
			sticker = dbData.sticker ? `**S:** ID: \`${dbData.sticker.id}\` | **Name:** ${dbData.sticker.name} | **Format:** ${dbData.sticker.format}\n` : "";
			attachment = dbData.attachments.length > 0 ? `**A**: ${dbData.attachments.join("\n")}` : "";
			// @ts-expect-error
			embeds = dbData.embed;
		} else {
			if (message.author.id === this.client.user?.id) return;
			author = message.author;
			channel = message.channel as TextBasedChannel;
			guild = message.guild;
			content = message.content;
			sticker = message.stickers.first() ? `**S:** ID: \`${message.stickers.first()?.id}\` | **Name:** ${message.stickers.first()?.name} | **Format:** ${message.stickers.first()?.format}\n` : "";
			attachment = message.attachments.first() // @ts-expect-error
				? `**A**: ${message.attachments.map((attach: MessageAttachment) => `**${attach.name}**\n${message.channel.nsfw ? `|| ${attach.proxyURL} ||` : attach.proxyURL}`).join("\n")}\n`
				: "";
			embeds = message.embeds.length > 0 ? message.embeds : null;

			if (guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
				const logs: GuildAuditLogs<"MESSAGE_DELETE"> = await guild.fetchAuditLogs({ limit: 1, type: "MESSAGE_DELETE" });
				const first = logs.entries.first();
				if (first) {
					const { executor, createdTimestamp } = first;
					if (Date.now() < createdTimestamp + 3000)
						msg = await this.client.bulbutils.translate("event_message_delete_moderator", guild.id, {
							user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
							// This cast changes the type of the `id` property from optional to required
							user: author as typeof author & Required<Pick<typeof author, "id">>,
							moderator: executor || { id: "Unknown ID", tag: "Unknown User" },
							message,
							channel,
							content: content ? `**C:** ${Util.cleanContent(content, channel)}\n` : "",
							reply: message.type === "REPLY" ? `**Reply to:** https://discord.com/channels/${message.reference?.guildId}/${message.reference?.channelId}/${message.reference?.messageId}\n` : "",
							sticker,
							attachment,
						});
				}
			}
		}

		if (!msg)
			msg = await this.client.bulbutils.translate("event_message_delete", guild.id, {
				user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
				user: author as typeof author & Required<Pick<typeof author, "id">>,
				message,
				channel,
				content: content ? `**C:** ${Util.cleanContent(content, channel)}\n` : "",
				reply: message.type === "REPLY" ? `**Reply to:** https://discord.com/channels/${message.reference?.guildId}/${message.reference?.channelId}/${message.reference?.messageId}\n` : "",
				sticker,
				attachment,
			});

		if (msg.length >= 1850) {
			fs.writeFileSync(`${__dirname}/../../../files/MESSAGE_DELETE-${guild.id}.txt`, content);
			await loggingManager.sendEventLog(
				this.client,
				guild,
				"message",
				await this.client.bulbutils.translate("event_message_delete_special", guild.id, {
					user_tag: author.bot ? `${author.tag} :robot:` : author.tag,
					user: author as typeof author & Required<Pick<typeof author, "id">>,
					message,
					channel,
				}),
				`${__dirname}/../../../files/MESSAGE_DELETE-${guild.id}.txt`,
			);
		} else await loggingManager.sendEventLog(this.client, guild, "message", msg, embeds ? embeds : null);
	}
}

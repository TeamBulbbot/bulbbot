import BulbBotClient from "../structures/BulbBotClient";
import { Message, Permissions } from "discord.js";
import DatabaseManager from "./managers/DatabaseManager";
import { AutoMod_INVITE, AutoMod_WEBSITE, UserMention } from "./Regex";
import { set } from "../structures/AutoModCache";
import AutoModManager from "./managers/AutoModManager";
import LoggingManager from "./managers/LoggingManager";
import { isGuildChannel } from "./typechecks";
import { Automod } from "@prisma/client";

const databaseManager: DatabaseManager = new DatabaseManager();
const automodManager: AutoModManager = new AutoModManager();
const loggingManager: LoggingManager = new LoggingManager();

export default async function (client: BulbBotClient, message: Message): Promise<void> {
	if (!message.guild?.available || !isGuildChannel(message.channel)) return;
	const dbGuild = await databaseManager.getAutoModConfig(message.guild);

	if (!dbGuild.enabled) return;
	if (message.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;
	if (dbGuild.ignoreUsers.includes(message.author.id)) return;
	if (dbGuild.ignoreChannels.includes(message.channel.id) || (message.channel.parent && dbGuild.ignoreChannels.includes(message.channel.parent.id))) return;

	if (!message.member?.roles.cache.values()) return;
	for (const role of message.member.roles.cache.values()) {
		if (dbGuild.ignoreRoles.includes(role.id)) return;
	}

	let shouldDelete = false;

	if (hasWebsite(message, dbGuild)) {
		const punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentWebsite,
			await client.bulbutils.translate("automod_violation_website_reason", message.guild.id, {
				channel: message.channel,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			message.guild,
			await client.bulbutils.translate("automod_violation_website_log", message.guild.id, {
				target: message.author,
				channel: message.channel,
				punishment,
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	if (hasInvite(message, dbGuild)) {
		const punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentInvites,
			await client.bulbutils.translate("automod_violation_invites_reason", message.guild.id, {
				channel: message.channel,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			message.guild,
			await client.bulbutils.translate("automod_violation_invites_log", message.guild.id, {
				target: message.author,
				channel: message.channel,
				punishment,
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	let word: string;
	if ((word = hasSwearWords(message, dbGuild))) {
		const punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentWords,
			await client.bulbutils.translate("automod_violation_words_reason", message.guild.id, {
				channel: message.channel,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			message.guild,
			await client.bulbutils.translate("automod_violation_words_log", message.guild.id, {
				target: message.author,
				channel: message.channel,
				punishment,
				words: word,
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	const mentionCount: number = hasMentions(message, dbGuild);
	if (mentionCount) {
		if (dbGuild.punishmentMentions) await set(client, message, message.guild.id, "mentions", message.author.id, mentionCount, dbGuild.timeoutMentions ?? undefined);
		if (dbGuild.limitMentions) shouldDelete ||= mentionCount >= dbGuild.limitMentions;
	}

	await set(client, message, message.guild.id, "messages", message.author.id, 1, dbGuild.timeoutMessages ?? undefined);
	if (shouldDelete) await message.delete();
}

function hasSwearWords(message: Message, guild: Pick<Automod, "punishmentWords" | "wordBlacklist" | "wordBlacklistToken">): string {
	if (!guild.punishmentWords) return "";
	const wordBlacklist: string[] = guild.wordBlacklist;

	for (const word of wordBlacklist) {
		const regex = new RegExp(`(?:^|\\s)${word}(?:$|\\s)`, "i");
		if (regex.test(message.content)) return word;
	}

	const wordBlacklistToken: string[] = guild.wordBlacklistToken.map((t) => t.toLowerCase());
	const content: string = message.content.toLowerCase();

	for (const token of wordBlacklistToken) {
		if (content.includes(token)) return token;
	}

	return "";
}

function hasWebsite(message: Message, guild: Pick<Automod, "punishmentWebsite" | "websiteWhitelist">): boolean {
	if (!guild.punishmentWebsite) return false;
	const blocked_websites: string[] = guild.websiteWhitelist;
	AutoMod_WEBSITE.lastIndex = 0;
	if (!blocked_websites) return false;

	let match: RegExpExecArray | null;
	while ((match = AutoMod_WEBSITE.exec(message.content))) {
		if (blocked_websites.includes(match[2])) return true;
	}

	return false;
}

function hasInvite(message: Message, guild: Pick<Automod, "punishmentInvites" | "inviteWhitelist">): boolean {
	if (!guild.punishmentInvites) return false;
	const allowed_invites: string[] = guild.inviteWhitelist;
	AutoMod_INVITE.lastIndex = 0;
	if (!allowed_invites) return AutoMod_INVITE.test(message.content);

	let match: RegExpExecArray | null;
	while ((match = AutoMod_INVITE.exec(message.content))) {
		if (!allowed_invites.includes(match[3])) return true;
	}

	return false;
}

function hasMentions(message: Message, guild: Pick<Automod, "punishmentMentions" | "limitMentions">): number {
	if (!(guild.punishmentMentions || guild.limitMentions)) return 0;
	return message.content.match(UserMention)?.length ?? 0;
}

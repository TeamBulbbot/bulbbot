import BulbBotClient from "../structures/BulbBotClient";
import { Guild, Message, Snowflake, TextChannel } from "discord.js";
import DatabaseManager from "./managers/DatabaseManager";
import { AutoMod_INVITE, AutoMod_WEBSITE, UserMention } from "./Regex";
import { set } from "../structures/AutoModCache";
import AutoModManager from "./managers/AutoModManager";
import LoggingManager from "./managers/LoggingManager";
import { AutoModConfiguration } from "./types/AutoModConfiguration";

const databaseManager: DatabaseManager = new DatabaseManager();
const automodManager: AutoModManager = new AutoModManager();
const loggingManager: LoggingManager = new LoggingManager();

export default async function (client: BulbBotClient, message: Message): Promise<void> {
	const dbGuild: AutoModConfiguration = await databaseManager.getAutoModConfig(<Snowflake>message.guild?.id);

	if (!dbGuild.enabled) return;
	if (message.member?.hasPermission("MANAGE_MESSAGES")) return;
	if (dbGuild.ignoreUsers.includes(message.author.id)) return;
	if (dbGuild.ignoreChannels.includes(message.channel.id)) return;

	if (!message.member?.roles.cache.values()) return;
	for (const role of message.member?.roles.cache.values()) {
		if (dbGuild.ignoreRoles.includes(role.id)) return;
	}

	let shouldDelete: boolean = false;

	if (hasWebsite(message, dbGuild)) {
		let punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentWebsite,
			await client.bulbutils.translate("automod_violation_website_reason", message.guild?.id, {
				channel_name: (<TextChannel>message.channel).name,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			<Guild>message.guild,
			await client.bulbutils.translate("automod_violation_website_log", message.guild?.id, {
				target_tag: message.author.tag,
				target_id: message.author.id,
				channel_id: message.channel.id,
				punishment,
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	if (hasInvite(message, dbGuild)) {
		let punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentInvites,
			await client.bulbutils.translate("automod_violation_invites_reason", message.guild?.id, {
				channel_name: (<TextChannel>message.channel).name,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			<Guild>message.guild,
			await client.bulbutils.translate("automod_violation_invites_log", message.guild?.id, {
				target_tag: message.author.tag,
				target_id: message.author.id,
				channel_id: message.channel.id,
				punishment,
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	if (hasSwearWords(message, dbGuild)) {
		let punishment: string = await automodManager.resolveAction(
			client,
			message,
			dbGuild.punishmentWords,
			await client.bulbutils.translate("automod_violation_words_reason", message.guild?.id, {
				channel_name: (<TextChannel>message.channel).name,
			}),
		);

		await loggingManager.sendAutoModLog(
			client,
			<Guild>message.guild,
			await client.bulbutils.translate("automod_violation_words_log", message.guild?.id, {
				target_tag: message.author.tag,
				target_id: message.author.id,
				channel_id: message.channel.id,
				punishment,
				words: hasSwearWords(message, dbGuild),
				message: message.content,
			}),
		);
		shouldDelete = true;
	}

	const mentionCount: number = await hasMentions(client, message, dbGuild);
	if (mentionCount) {
		const mentionsLimit = dbGuild.limitMentions;
		if (mentionsLimit) shouldDelete = mentionCount >= mentionsLimit;
	}

	await set(client, message, <Snowflake>message.guild?.id, "messages", message.author.id, 1, dbGuild.timeoutMessages);
	if (shouldDelete) await message.delete({ reason: "AutoMod check violation detected" });
}

function hasSwearWords(message: Message, guild: AutoModConfiguration): string | boolean {
	if (!guild.punishmentWords) return false;
	const wordBlacklist: string[] = guild.wordBlacklist;

	for (const word of wordBlacklist) {
		const regex: RegExp = new RegExp(`(?:^|\\s)${word}(?:$|\\s)`, "i");
		if (regex.test(message.content)) return word;
	}

	const wordBlacklistToken: string[] = <string[]>guild.wordBlacklistToken;

	for (const token of wordBlacklistToken) {
		const regex: RegExp = new RegExp(`(?:^|\\s)${token}(?:$|\\s)`, "i");
		if (regex.test(message.content)) return token;
	}

	return false;
}

function hasWebsite(message: Message, guild: AutoModConfiguration): boolean {
	if (!guild.punishmentWebsite) return false;
	const blocked_websites: string[] = guild.websiteWhitelist;
	if (!blocked_websites) return false;

	let match;
	while ((match = new RegExp(AutoMod_WEBSITE, "gi").exec(message.content))) {
		if (blocked_websites.includes(match[2])) return true;
	}

	return false;
}

function hasInvite(message: Message, guild: AutoModConfiguration): boolean {
	if (!guild.punishmentInvites) return false;
	const allowed_invites: string[] = guild.inviteWhitelist;
	if (!allowed_invites) return AutoMod_INVITE.test(message.content);

	let match;
	while ((match = new RegExp(AutoMod_INVITE, "gi").exec(message.content))) {
		if (!allowed_invites.includes(match[3])) return true;
	}

	return false;
}

async function hasMentions(client: BulbBotClient, message: Message, guild: AutoModConfiguration): Promise<number> {
	const mentions = message.content.match(new RegExp(UserMention, "g"));

	if (mentions) {
		await set(client, message, <Snowflake>message.guild?.id, "mentions", message.author.id, mentions.length, guild.timeoutMentions);
		return mentions.length;
	}

	return 0;
}

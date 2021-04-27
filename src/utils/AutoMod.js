const AutoModCache = require("../structures/AutoModCache");
const AutoModUtils = require("../utils/AutoModUtils");
const { AutoMod_INVITE, AutoMod_WEBSITE, UserMention, makeGlobal } = require("./Regex");
const { SendAutoModLog } = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const UserMentionGlobal = makeGlobal(UserMention);

module.exports = {
	Master: async (client, message, clearance) => {
		if (message === undefined || message.author.id === global.config.client.id) return;
		const dbGuild = await AutoModUtils.getGuildAutoMod(message.guild.id);
		if (dbGuild === null) return;

		if (dbGuild.automod === null || !dbGuild.automod.enabled) return;
		if (clearance >= 25) return;
		if (message.member.hasPermission("MANAGE_MESSAGES")) return;

		let shouldDelete = false;

		if (await hasInvite(message, dbGuild.automod)) {
			await AutoModUtils.resolveAction(client, message, dbGuild.automod.punishmentInvites, `Violated \`DISCORD INVITE\` in #${message.channel.name}`);
			await SendAutoModLog(
				client,
				dbGuild.guildId,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`DISCORD INVITE\` check in <#${message.channel.id}>\`\`\`${message.content}\`\`\``,
			);

			shouldDelete = true;
		}

		if (await hasSwearWords(message, dbGuild.automod)) {
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentWords,
				`Violated \`FORBIDDEN WORDS\` check in #${message.channel.name}`,
			);
			await SendAutoModLog(
				client,
				dbGuild.guildId,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`FORBIDDEN WORDS\` check in <#${
					message.channel.id
				}>\n**Blacklisted words:** \`${await hasSwearWords(message, dbGuild.automod)}\`\n\`\`\`${message.content}\`\`\``,
			);
			shouldDelete = true;
		}

		if (await hasWebsite(message, dbGuild.automod)) {
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentWebsite,
				`Violated \`FORBIDDEN WEBSITE\` in #${message.channel.name}`,
			);
			await SendAutoModLog(
				client,
				dbGuild.guildId,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`FORBIDDEN WEBSITE\` check in <#${message.channel.id}>\n\`\`\`${message.content}\`\`\``,
			);
			shouldDelete = true;
		}

		
		const mentionCount = await hasMentions(client, message);
		if (mentionCount) {
			const mentionsLimit = await AutoModUtils.getMentionsLimit(message.guild.id);
			if (mentionsLimit)
				shouldDelete = mentionCount >= mentionsLimit;
		}

		await AutoModCache.set(client, message, message.guild.id, "messages", message.author.id, 1, 10000);
		if (shouldDelete) await message.delete({reason: "AutoMod"});
	},
};

async function hasInvite(message, dbGuild) {
	if (dbGuild.punishmentInvites === null) return false;
	const allowed_invites = dbGuild.inviteWhitelist;
	if (!allowed_invites) return AutoMod_INVITE.test(message.content);

	let match;
	const AutoMod_INVITE_Global = makeGlobal(AutoMod_INVITE);
	while (match = AutoMod_INVITE_Global.exec(message.content)) {
		if (!allowed_invites.includes(match[1])) return true;
	}

	return false;
}

async function hasSwearWords(message, dbGuild) {
	const word_blacklist = dbGuild.wordBlacklist;
	for (const word of word_blacklist) {
		const regex = new RegExp(`(?:^|\\s)${word}(?:$|\\s)`, "i");
		if (regex.test(message.content)) return word;
	}

	const word_blacklist_token = dbGuild.wordBlacklistToken;
	for (const token of word_blacklist_token) {
		if (message.content.includes(token)) return token;
	}

	return false;
}

async function hasMentions(client, message) {
	const mentions = message.content.match(UserMentionGlobal);

	if (mentions) {
		await AutoModCache.set(client, message, message.guild.id, "mentions", message.author.id, mentions.length, 15000);
		return mentions.length;
	}

	return 0;
}

async function hasWebsite(message, dbGuild) {
	if (dbGuild.punishmentWebsite === null) return false;
	const allowed_websites = dbGuild.websiteWhitelist;
	if (!allowed_websites) return AutoMod_WEBSITE.test(message.content);

	let match;
	const AutoMod_WEBSITE_Global = makeGlobal(AutoMod_WEBSITE);
	while (match = AutoMod_WEBSITE_Global.exec(message.content)) {
		let website = match.slice(1).join("");
		if (website.endsWith("/")) website = website.slice(0, -1);
		if (AutoMod_INVITE.test(website)) continue;
		if (!allowed_websites.includes(website)) return true;
	}
	
	return false;
}

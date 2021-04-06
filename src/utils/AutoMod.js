const AutoModCache = require("../structures/AutoModCache");
const AutoModUtils = require("../utils/AutoModUtils");
const { AutoMod_INVITE, AutoMod_WEBSITE, UserMention } = require("./Regex");
const { SendAutoModLog } = require("../utils/moderation/log");
const Emotes = require("../emotes.json");

module.exports = {
	Master: async (client, message, clearance) => {
		if (message === undefined || message.author.id === global.config.client.id) return;
		const dbGuild = await AutoModUtils.getGuildAutoMod(message.guild.id);
		if (dbGuild === null) return;

		if (dbGuild.automod === null || !dbGuild.automod.enabled) return;
		if (clearance >= 25) return;
		if (message.member.hasPermission("MANAGE_MESSAGES")) return;

		if (await hasInvite(message, dbGuild.automod)) {
			await AutoModUtils.resolveAction(client, message, dbGuild.automod.punishmentInvites, `Violated \`DISCORD INVITE\` in #${message.channel.name}`);
			await SendAutoModLog(
				client,
				dbGuild.guildId,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`DISCORD INVITE\` check in <#${message.channel.id}>\`\`\`${message.content}\`\`\``,
			);

			message.delete();
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
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`FORBIDDEN WORDS\` check in <#${message.channel.id}>\n**Blacklisted words:** \`${await hasSwearWords(message, dbGuild.automod)}\`\n\`\`\`${message.content}\`\`\``,
			);
			message.delete();
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
			message.delete();
		}

		if (await hasMentions(client, message)) {
			return await AutoModCache.set(client, message, message.guild.id, "messages", message.author.id, 1, 10000);
		}

		await AutoModCache.set(client, message, message.guild.id, "messages", message.author.id, 1, 10000);
	},
};

async function hasInvite(message, dbGuild) {
	if (dbGuild.punishmentInvites === null) return false;
	const allowed_invites = dbGuild.inviteWhitelist;
	for (const invite of allowed_invites) {
		let regex = new RegExp(`(http://|https://)?(www.)?(discord.gg|discord.me|discordapp.com/invite|discord.com/invite)/(${invite})+`, "gi");
		if (message.content.match(regex)) return false;
	}

	return message.content.match(AutoMod_INVITE);
}

async function hasSwearWords(message, dbGuild) {
	const word_blacklist = dbGuild.wordBlacklist;
	for (const word of word_blacklist) {
		const regex = new RegExp(`(?:^|\\W)${word}(?:$|\\W)`, "gi");
		if (message.content.match(regex)) return word;
	}

	const word_blacklist_token = dbGuild.wordBlacklistToken;
	for (const word of word_blacklist_token) {
		const regex = new RegExp(`(${word})`, "gi");
		if (message.content.match(regex)) return word;
	}

	return false;
}

async function hasMentions(client, message) {
	let mentionCount = message.content.match(UserMention);

	if (mentionCount && mentionCount.length > 0) {
		await AutoModCache.set(client, message, message.guild.id, "mentions", message.author.id, mentionCount.length, 15000);
		return true;
	}

	return false;
}

async function hasWebsite(message, dbGuild) {
	if (dbGuild.punishmentWebsite === null) return false;
	return !!message.content.match(AutoMod_WEBSITE);
}

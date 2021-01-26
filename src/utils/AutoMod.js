const AutoModCache = require("../structures/AutoModCache");
const AutoModUtils = require("../utils/AutoModUtils");
const { AutoMod_INVITE, AutoMod_WEBSITE, UserMentionStrict } = require("./Regex");
const { SendAutoModLog } = require("../utils/moderation/log");
const Emotes = require("../emotes.json");

module.exports = {
	Master: async (client, message) => {
		if (message === undefined || message.author.id === global.config.client.id) return;
		const dbGuild = await AutoModUtils.getGuildAutoMod(message.guild.id);

		// TODO make a check if a user has > 25 clearance level and return
		if (dbGuild.automod === null || !dbGuild.automod.enabled) return;

		if (await hasInvite(message, dbGuild.automod)) {
			await AutoModUtils.resolveAction(client, message, dbGuild.automod.punishmentInvites, `Violated \`DISCORD INVITE\` in #${message.channel.name}`);
			await SendAutoModLog(
				client,
				dbGuild.guildId,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`DISCORD INVITE\` check in <#${message.channel.id}>`,
			);
			return message.delete();
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
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`FORBIDDEN WORDS\` check in <#${message.channel.id}>`,
			);
			return message.delete();
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
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`FORBIDDEN WEBSITE\` check in <#${message.channel.id}>`,
			);
			return message.delete();
		}

		if (await hasMentions(message)) {
			await AutoModCache.set(message, message.guild.id, "messages", message.author.id, 1, 10000);
		}
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
		const regex = new RegExp(`(${word})`, "gi");
		if (message.content.match(regex)) return true;
	}

	return false;
}

async function hasMentions(message) {
	let mentionCount = message.content.match(UserMentionStrict);

	if (mentionCount && mentionCount.length > 0) {
		await AutoModCache.set(message, message.guild.id, "mentions", message.author.id, mentionCount.length, 15000);
		return true;
	}

	return false;
}

async function hasWebsite(message, dbGuild) {
	if (dbGuild.punishmentWebsite === null) return false;
	return !!message.content.match(AutoMod_WEBSITE);
}

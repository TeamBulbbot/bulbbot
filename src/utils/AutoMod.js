const AutoModCache = require("../structures/AutoModCache");
const AutoModUtils = require("../utils/AutoModUtils")
const { AutoMod_INVITE, AutoMod_WEBSITE, UserMentionStrict } = require("./Regex");

module.exports = {
	Master: async message => {
		if (message.author.id === "758659947419402251") return;
		if (!(await AutoModUtils.getEnabled(message.guild.id))) return;

		if (await hasInvite(message)) {
			await AutoModUtils.resolveAction(message, /*await AutoModUtils.getPunishment(message.guild.id, "INVITE")*/ ["KICK"])
			message.delete();
		}

		if (await hasSwearWords(message)) {
			await AutoModUtils.resolveAction(message, await AutoModUtils.getPunishment(message.guild.id, "WORDS"))
			message.delete();
		}

		if (await hasWebsite(message)) {
			message.delete();
			//SEND AUTOMOD LOG
		}

		if (!await hasMentions(message)) await AutoModCache.set(message, message.guild.id, "messages", message.author.id, 1, 10000);
	},
};

async function hasInvite(message) {
	const allowed_invites = await AutoModUtils.getInviteWhitelist(message.guild.id)
	for (const invite of allowed_invites) {
		let regex = new RegExp(`(http://|https://)?(www.)?(discord.gg|discord.me|discordapp.com/invite|discord.com/invite)/(${invite})+`, "gi");
		if (message.content.match(regex)) {
			return false;
		}
	}
	return message.content.match(AutoMod_INVITE);
}

async function hasSwearWords(message) {
	const word_blacklist = await AutoModUtils.getWordBlacklist(message.guild.id)
	for (const word of word_blacklist) {
		const regex = new RegExp(`(${word})`, "gi");
		if (message.content.match(regex)) return true;
	}

	return false;
}

async function hasMentions(message) {
	let mentionCount = message.content.match(UserMentionStrict)
	if (mentionCount && mentionCount.length > 0) {
		await AutoModCache.set(message, message.guild.id, "mentions", message.author.id, mentionCount.length, 15000);
		return true;
	}

	return false;
}

async function hasWebsite(message) {
	return !!message.content.match(AutoMod_WEBSITE);
}

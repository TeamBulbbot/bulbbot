const AutoModUtils = require("./../utils/AutoModUtils");
const { SendAutoModLog } = require("..//utils/moderation/log");
const Emotes = require("../emotes.json");

let cache = {};

module.exports = {
	set: async (client, message, guild, category, user, value, timeout = 10000) => {
		if (cache[guild] === undefined) cache[guild] = { mentions: {}, messages: {} };

		if (!cache[guild][category][user]) cache[guild][category][user] = value;
		else cache[guild][category][user] = cache[guild][category][user] + value;

		const dbGuild = await AutoModUtils.getGuildAutoMod(guild);

		//PUNISHMENTS
		if (
			cache[guild]["mentions"][user] >= (await AutoModUtils.getMentionsLimit(message.guild.id)) &&
			(await AutoModUtils.getMentionsLimit(message.guild.id)) !== 0
		) {
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentMentions,
				`Violated \`MAX MENTIONS\` check in #${message.channel.name}`,
			);
			await SendAutoModLog(
				client,
				guild,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`MAX MENTIONS\` check in <#${message.channel.id}>\n\`\`\`${message.content}\`\`\``,
			);
			delete cache[guild]["mentions"][user];
		}

		if (
			cache[guild]["messages"][user] >= (await AutoModUtils.getMessageLimit(message.guild.id)) &&
			(await AutoModUtils.getMessageLimit(message.guild.id)) !== 0
		) {
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentMessages,
				`Violated \`MAX MESSAGES\` check in #${message.channel.name}`,
			);
			delete cache[guild]["messages"][user];
		}

		setTimeout(function () {
			if (cache[guild] === undefined || cache[guild][category] === undefined || cache[guild][category][user] === undefined) return;

			cache[guild][category][user] = cache[guild][category][user] - value;
			if (cache[guild][category][user] <= 0) delete cache[guild][category][user];
			if (Object.keys(cache[guild]["messages"]).length === 0 && Object.keys(cache[guild]["mentions"]).length === 0) delete cache[guild];
		}, timeout);
	},

	getAll: () => {
		return cache;
	},
};

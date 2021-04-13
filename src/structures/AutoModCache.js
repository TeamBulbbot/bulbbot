const AutoModUtils = require("./../utils/AutoModUtils");
const { SendAutoModLog } = require("../utils/moderation/log");
const Emotes = require("../emotes.json");

let cache = {};

module.exports = {
	set: async (client, message, guild, category, user, value, timeout = 10000) => {
		if (cache[guild] === undefined) cache[guild] = { mentions: {}, messages: {} };

		if (!cache[guild][category][user]) cache[guild][category][user] = { count: value, time: Date.now() };
		else cache[guild][category][user]["count"] = cache[guild][category][user]["count"] + value;

		const dbGuild = await AutoModUtils.getGuildAutoMod(guild);

		const messageLimit = await AutoModUtils.getMessageLimit(message.guild.id);
		const mentionsLimit = await AutoModUtils.getMentionsLimit(message.guild.id);
		console.log(JSON.stringify(cache));

		if (cache[guild]["messages"][user] && cache[guild]["messages"][user]["count"] >= messageLimit && messageLimit !== 0) {
			console.log("messages");
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentMessages,
				`Violated \`MAX MESSAGES\` check in #${message.channel.name} (${cache[guild]["messages"][user]["time"]}/10s)`,
			);
			await SendAutoModLog(
				client,
				guild,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`MAX MESSAGES\` check in <#${
					message.channel.id
				}>. Messages (${cache[guild]["messages"][user]["count"]}/${(Date.now() - cache[guild]["messages"][user]["time"]) / 1000}s)`,
			);
			delete cache[guild]["messages"][user];
		}
		console.log(JSON.stringify(cache))

		if (cache[guild]["mentions"][user] && cache[guild]["mentions"][user]["count"] >= mentionsLimit && mentionsLimit !== 0) {
			console.log("mentions");
			await AutoModUtils.resolveAction(
				client,
				message,
				dbGuild.automod.punishmentMentions,
				`Violated \`MAX MENTIONS\` check in #${message.channel.name} (${cache[guild]["mentions"][user]["time"]}/15s)`,
			);
			await SendAutoModLog(
				client,
				guild,
				`${Emotes.actions.WARN} **${message.author.tag}** \`${message.author.id}\` has violated the \`MAX MENTIONS\` check in <#${
					message.channel.id
				}>. Mentions (${cache[guild]["mentions"][user]["count"]}/${(Date.now() - cache[guild]["mentions"][user]["time"]) / 1000}s)`,
			);
			delete cache[guild]["mentions"][user];
		}

		setTimeout(function () {
			if (cache[guild] === undefined || cache[guild][category] === undefined || cache[guild][category][user] === undefined) return;

			cache[guild][category][user]["count"] = cache[guild][category][user]["count"] - value;
			cache[guild][category][user]["time"] = Date.now();
			if (cache[guild][category][user]["count"] <= 0) delete cache[guild][category][user];
			if (Object.keys(cache[guild]["messages"]).length === 0 && Object.keys(cache[guild]["mentions"]).length === 0) delete cache[guild];
			console.log(JSON.stringify(cache));
		}, timeout);
	},

	getAll: () => {
		return cache;
	},
};

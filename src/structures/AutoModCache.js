const AutoModUtils = require("./../utils/AutoModUtils");

let cache = {};

module.exports = {
	set: async (message, guild, category, user, value, timeout = 10000) => {
		if (cache[guild] === undefined) cache[guild] = { mentions: {}, messages: {} };

		if (!cache[guild][category][user]) cache[guild][category][user] = value;
		else cache[guild][category][user] = cache[guild][category][user] + value;

		//PUNISHMENTS
		if (
			cache[guild]["mentions"][user] >= (await AutoModUtils.getMentionsLimit(message.guild.id)) &&
			(await AutoModUtils.getMentionsLimit(message.guild.id)) !== 0
		) {
			await AutoModUtils.resolveAction(message, await AutoModUtils.getPunishment(message.guild.id, "MENTIONS"));
			delete cache[guild]["mentions"][user];
		}

		if (
			cache[guild]["messages"][user] >= (await AutoModUtils.getMessageLimit(message.guild.id)) &&
			(await AutoModUtils.getMessageLimit(message.guild.id)) !== 0
		) {
			await AutoModUtils.resolveAction(message, await AutoModUtils.getPunishment(message.guild.id, "MESSAGES"));
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

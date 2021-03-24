const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Search the current guild for a given query",
			category: "Miscellaneous",
			usage: "!search <query>",
			examples: ["search mrphilip"],
			argList: ["query:string"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		const query = args.join(" ");
		let desc = [];

		message.guild.members.cache.array().forEach(member => {
			if (similarity(member.user.username, query) >= 0.6) desc.push(`${member.user.tag} (${member.user.id})`);
		});
		desc.sort();
		if (desc.length === 0) desc = await this.client.bulbutils.translate("global_user_not_found");

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setAuthor(`Query: ${query}`)
			.setDescription(desc)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = [];
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

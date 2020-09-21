const Log = require("../models/log");
const moment = require("moment");
const Emotes = require("../emotes.json");

module.exports = async (client, message) => {
	if (message.author.bot) return;
	Log.findOne(
		{
			guildID: message.guild.id,
		},
		async (err, res) => {
			if (err) console.error(`[Message Delete] ${clc.red(err)}`);
			if (res.message === "") return;
			client.channels.cache
				.get(res.message)
				.send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${Emotes.other.trash} Message from **${message.author.username}**#${message.author.discriminator} was deleted in **${message.channel.name}** \`\`(${message.channel.id})\`\`\n**Content:** ${message.content}`);
		}
	);
};

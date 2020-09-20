const Log = require("../models/log");
const moment = require("moment");
const Emotes = require("../emotes.json");

module.exports = async (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return; // Message was not edit but something else happend ( ͡° ͜ʖ ͡°)
	Log.findOne(
		{
			guildID: newMessage.guild.id,
		},
		async (err, res) => {
			if (res.message === "") return;
			client.channels.cache
				.get(res.message)
				.send(
					`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${Emotes.other.wrench} Message from **${newMessage.author.username}**#${newMessage.author.discriminator} was edited in **${newMessage.channel.name}** \`\`(${newMessage.channel.id})\`\`\n**Old Message:** ${oldMessage.content}\n**New Message:** ${
						newMessage.content
					}`
				);
		}
	);
};

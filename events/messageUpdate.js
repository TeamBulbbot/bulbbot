const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");

module.exports = async (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return; // Message was not edit but something else happend ( ͡° ͜ʖ ͡°)

	SendLog.Message_Log(
		client,
		newMessage.guild.id,
		`${Emotes.other.wrench} Message from **${newMessage.author.username}**#${newMessage.author.discriminator} was edited in **${newMessage.channel.name}** \`\`(${newMessage.channel.id})\`\`\n**Old Message:** ${oldMessage.content}\n**New Message:** ${newMessage.content}`
	);
};

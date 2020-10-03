const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");
const Validate = require("../handlers/validate");

module.exports = async (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return; // Message was not edit but something else happend ( ͡° ͜ʖ ͡°)

	oldMessage.content = await Validate.Master(client, oldMessage.content);
	newMessage.content = await Validate.Master(client, newMessage.content);

	SendLog.Message_Log(
		client,
		newMessage.guild.id,
		`${Emotes.other.wrench} Message from **${newMessage.author.username}**#${newMessage.author.discriminator} was edited in <#${newMessage.channel.id}> \`\`(${newMessage.channel.id})\`\`\n**Old Message:** ${oldMessage.content}\n**New Message:** ${newMessage.content}`
	);
};

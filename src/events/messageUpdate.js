const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const Validate = require("../utils/helper/validate");

module.exports = async (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return; // Message was not edit but something else happend ( ͡° ͜ʖ ͡°)

	(oldMessage.content = await Validate.Master(
		client,
		oldMessage.content,
		oldMessage.guild
	)),
		(newMessage.content = await Validate.Master(
			client,
			newMessage.content,
			newMessage.guild
		));

	Log.Message_Log(
		client,
		newMessage.guild.id,
		`${Emotes.other.wrench} Message from **${newMessage.author.username}**#${newMessage.author.discriminator} \`\`(${newMessage.author.id})\`\` was edited in <#${newMessage.channel.id}> \`\`(${newMessage.channel.id})\`\`\n**Old Message:** ${oldMessage.content}\n**New Message:** ${newMessage.content}`
	);
};

const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");
const Validate = require("../handlers/validate");

module.exports = async (client, message) => {
	if (message.author.bot) return;

	message.content = await Validate.Master(client, message.content);

	SendLog.Message_Log(
		client,
		message.guild.id,
		`${Emotes.other.trash} Message from **${message.author.username}**#${message.author.discriminator} was deleted in **${message.channel.name}** \`\`(${message.channel.id})\`\`\n**Content:** ${message.content}`
	);
};

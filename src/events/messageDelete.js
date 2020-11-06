const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const Validate = require("../utils/helper/validate");

module.exports = async (client, message) => {
	if (message.author.bot) return;

	message.content = await Validate.Master(client, message.content);

	Log.Message_Log(
		client,
		message.guild.id,
		`${Emotes.other.trash} Message from **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` was deleted in <#${message.channel.id}> \`\`(${message.channel.id})\`\`\n**Content:** ${message.content}`
	);
};

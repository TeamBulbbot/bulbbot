const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const Validate = require("../utils/helper/validate");
const Translator = require("../utils/lang/translator")

module.exports = async (client, oldMessage, newMessage) => {
	if (oldMessage.author.bot) return;
	if (oldMessage.content === newMessage.content) return; // Message was not edited but something else happen ( ͡° ͜ʖ ͡°)

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

	await Log.Message_Log(
		client,
		newMessage.guild.id,
		Translator.Translate("event_message_update", {
			user: newMessage.author.username,
			user_discriminator: newMessage.author.discriminator,
			user_id: newMessage.author.id,
			new_value: newMessage.content,
			old_value: oldMessage.content,
			channel_id: newMessage.channel.id
		})
	);
};

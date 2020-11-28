const Log = require("../utils/moderation/log");
const Validate = require("../utils/helper/validate");
const Translator = require("../utils/lang/translator")

module.exports = async (client, message) => {
	if (message.author.bot) return;

	message.content = await Validate.Master(client, message.content, message)

	await Log.Message_Log(
		client,
		message.guild.id,
		Translator.Translate("event_message_delete", {
				user: message.author.username,
				user_discriminator: message.author.discriminator,
				user_id: message.author.id,
				channel_id: message.channel.id,
				new_value: message.content,
			})
	);
};

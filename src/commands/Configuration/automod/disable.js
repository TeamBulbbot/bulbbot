const { disable } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];

	if (part) {
		if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase())) return message.channel.send("invalid part");

		disable(message.guild.id, part.toLowerCase());
		message.channel.send("disabled that feature");
	} else {
		disable(message.guild.id, undefined);
		message.channel.send("disabled automod");
	}
};

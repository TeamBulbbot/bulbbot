const { disable } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];

	if (part) {
		if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase()))
			return message.channel.send(await client.bulbutils.translate("automod_invalid_part_v2"));

		disable(message.guild.id, part.toLowerCase());
		message.channel.send(await client.bulbutils.translate("automod_disabled_feature", { part }));
	} else {
		disable(message.guild.id, undefined);
		message.channel.send(await client.bulbutils.translate("automod_disabled"));
	}
};

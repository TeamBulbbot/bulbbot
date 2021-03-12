const { disable } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];

	if (part) {
		if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase()))
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_unexpected_list", {
					arg: part,
					arg_expected: "part:string",
					usage: "`website`, `invites`, `words`, `mentions` or `messages`",
				}),
			);

		await disable(message.guild.id, part.toLowerCase());
		message.channel.send(await client.bulbutils.translate("automod_disabled_feature", { part }));
	} else {
		await disable(message.guild.id, undefined);
		message.channel.send(await client.bulbutils.translate("automod_disabled"));
	}
};

const { changePunishment } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];
	const punishment = args[2];

	if (!part)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_missing_list", {
				arg: "part:string",
				arg_expected: 3,
				arg_provided: 1,
				usage: "`website`, `invites`, `words`, `mentions` or `messages`",
			}),
		);

	if (!punishment)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_missing_list", {
				arg: "punishment:string",
				arg_expected: 3,
				arg_provided: 1,
				usage: "`LOG`, `WARN`, `KICK` or `BAN`",
			}),
		);

	if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase()))
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_unexpected_list", {
				arg: part,
				arg_expected: "part:string",
				usage: "`website`, `invites`, `words`, `mentions` or `messages`",
			}),
		);

	if (!["LOG", "WARN", "KICK", "BAN"].includes(punishment.toUpperCase()))
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_unexpected_list", {
				arg: punishment,
				arg_expected: "punishment:string",
				usage: "`LOG`, `WARN`, `KICK` or `BAN`",
			}),
		);

	await changePunishment(message.guild.id, part.toLowerCase(), punishment.toUpperCase());

	message.channel.send(await client.bulbutils.translate("automod_updated_punishment", { part, punishment }));
};

const DatabaseManager = new (require("../../../utils/database/DatabaseManager"));
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args, part) => {
	let channel = args[1];

	if (!channel)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
				arg: "channel:Channel",
				arg_expected: 1,
				arg_provided: 0,
				usage: "!configure logging <channel>",
			}),
		);

	if (channel === "remove") channel = null;
	else {
		channel = channel.replace(NonDigits, "");
		const cTemp = message.guild.channels.cache.get(channel);
		if (cTemp === undefined)
			return message.channel.send(
				await client.bulbutils.translate("config_logging_invalid_channel", message.guild.id, {
					channel_name: args[1],
				}),
			);
		if (!cTemp.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
			return message.channel.send(await client.bulbutils.translate("config_logging_unable_to_send_messages", message.guild.id));
	}
	const gId = message.guild.id;

	switch (part) {
		case "modaction":
			await DatabaseManager.setModAction(gId, channel);
			break;
		case "automod":
			await DatabaseManager.setAutoMod(gId, channel);
			break;
		case "message":
			await DatabaseManager.setMessage(gId, channel);
			break;
		case "role":
			await DatabaseManager.setRole(gId, channel);
			break;
		case "member":
			await DatabaseManager.setMember(gId, channel);
			break;
		case "channel":
			await DatabaseManager.setChannel(gId, channel);
			break;
		case "joinleave":
			await DatabaseManager.setJoinLeave(gId, channel);
			break;
		default:
			message.channel.send("contact the developers this should not happen");
			return;
	}

	message.channel.send(
		await client.bulbutils.translate("config_logging_success", message.guild.id, { part: `\`${part}\``, channel: `<#${channel}>` }),
	);
};

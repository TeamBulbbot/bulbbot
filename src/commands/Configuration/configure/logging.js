const {
	ChangeAutoMod,
	ChangeChannel,
	ChangeJoinLeave,
	ChangeMember,
	ChangeMessage,
	ChangeModAction,
	ChangeRole,
} = require("../../../utils/configuration/GuildLogging");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args, part) => {
	let channel = args[1];

	if (!channel) return message.channel.send(await client.bulbutils.translate("event_message_args_missing", {
		arg: "channel:Channel",
		arg_expected: 1,
		arg_provided: 0,
		usage: "!configure logging <channel>"
	}));

	if (channel === "remove") channel = null;
	else {
		channel = channel.replace(NonDigits, "");
		const cTemp = message.guild.channels.cache.get(channel);
		if (cTemp === undefined) return message.channel.send(await client.bulbutils.translate("config_logging_invalid_channel", {
			channel_name: args[1]
		}));
		if (!cTemp.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
			return message.channel.send(await client.bulbutils.translate("config_logging_unable_to_send_messages"));
	}
	const gId = message.guild.id;

	switch (part) {
		case "modaction":
			await ChangeModAction(gId, channel);
			break;
		case "automod":
			await ChangeAutoMod(gId, channel);
			break;
		case "message":
			await ChangeMessage(gId, channel);
			break;
		case "role":
			await ChangeRole(gId, channel);
			break;
		case "member":
			await ChangeMember(gId, channel);
			break;
		case "channel":
			await ChangeChannel(gId, channel);
			break;
		case "joinleave":
			await ChangeJoinLeave(gId, channel);
			break;
		default:
			message.channel.send("contact the developers this should not happen");
			return;
	}

	message.channel.send(await client.bulbutils.translate("config_logging_success", { part: `\`${part}\``, channel: `<#${channel}>` }));
};

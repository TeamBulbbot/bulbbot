const { changePunishment } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];
	const punishment = args[2];

	if (!part) return message.channel.send(await client.bulbutils.translate("automod_missing_part_v2"));
	if (!punishment) return message.channel.send(await client.bulbutils.translate("automod_missing_punishment"));
	if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase()))
		return message.channel.send(await client.bulbutils.translate("automod_invalid_part_v2"));
	if (!["LOG", "WARN", "KICK", "BAN"].includes(punishment.toUpperCase()))
		return message.channel.send(await client.bulbutils.translate("automod_missing_punishment"));

	changePunishment(message.guild.id, part.toLowerCase(), punishment.toUpperCase());

	message.channel.send(await client.bulbutils.translate("automod_updated_punishment", { part, limit }));
};

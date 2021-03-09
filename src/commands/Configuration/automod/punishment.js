const { changePunishment } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];
	const punishment = args[2];

	if (!part) return message.channel.send("no part");
	if (!punishment) return message.channel.send("no punishment");
	if (!["website", "invites", "words", "mentions", "messages"].includes(part.toLowerCase())) return message.channel.send("invalid part");
	if (!["LOG", "WARN", "KICK", "BAN"].includes(punishment.toUpperCase())) return message.channel.send("invalid action");

	changePunishment(message.guild.id, part.toLowerCase(), punishment.toUpperCase());

	message.channel.send("updated the punishment");
};

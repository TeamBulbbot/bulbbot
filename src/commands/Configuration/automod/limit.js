const { changeLimit } = require("../../../utils/AutoModUtils");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	let limit = args[2];

	if (!part) return message.channel.send(await client.bulbutils.translate("automod_missing_part_v3"));
	if (!limit) return message.channel.send(await client.bulbutils.translate("automod_missing_limit"));
	if (!["mentions", "messages"].includes(part.toLowerCase()))
		return message.channel.send(await client.bulbutils.translate("automod_invalid_part_v3"));
	limit = parseInt(limit.replace(NonDigits, ""));
	if (isNaN(limit)) return message.channel.send(await client.bulbutils.translate("automod_non_number", { limit: args[2] }));
	if (limit <= 0) return message.channel.send(await client.bulbutils.translate("automod_less_than_zero", { limit }));

	changeLimit(message.guild.id, part.toLowerCase(), limit);

	message.channel.send(await client.bulbutils.translate("automod_updated_limit", { part, limit }));
};

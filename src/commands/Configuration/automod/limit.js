const { changeLimit } = require("../../../utils/AutoModUtils");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	let limit = args[2];

	if (!part) return message.channel.send("no part");
	if (!limit) return message.channel.send("no limit");
	if (!["mentions", "messages"].includes(part.toLowerCase())) return message.channel.send("invalid part");
	limit = parseInt(limit.replace(NonDigits, ""));
	if (isNaN(limit)) return message.channel.send("non number");
	if (limit <= 0) return message.channel.send("cant be less than 0");

	changeLimit(message.guild.id, part.toLowerCase(), limit);

	message.channel.send("updated the punishment");
};

const { append } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];
	const item = args[2];

	if (!part) return message.channel.send(await client.bulbutils.translate("automod_missing_part_v1"));
	if (!item) return message.channel.send(await client.bulbutils.translate("automod_missing_item_add"));
	if (!["website", "invites", "words"].includes(part.toLowerCase()))
		return message.channel.send(await client.bulbutils.translate("automod_invalid_part_v1"));

	const error = await append(message.guild.id, part.toLowerCase(), item);
	if (error === 1) return message.channel.send(await client.bulbutils.translate("automod_already_in_database", { item }));

	message.channel.send(await client.bulbutils.translate("automod_added_to_the_database", { part, item }));
};

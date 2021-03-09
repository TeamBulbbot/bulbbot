const { remove } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	const part = args[1];
	const item = args[2];

	if (!part) return message.channel.send(await client.bulbutils.translate("automod_missing_part_v1"));
	if (!item) return message.channel.send(await client.bulbutils.translate("automod_missing_item_remove"));
	if (!["website", "invites", "words"].includes(part.toLowerCase()))
		return message.channel.send(await client.bulbutils.translate("automod_invalid_part_v1"));

	const error = await remove(message.guild.id, part.toLowerCase(), item);
	if (error === 1) return message.channel.send(await client.bulbutils.translate("automod_not_already_in_database"));

	message.channel.send(await client.bulbutils.translate("automod_removed_from_the_database", { part, item }));
};

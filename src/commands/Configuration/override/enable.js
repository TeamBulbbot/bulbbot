const ClearanceManager = new (require("../../../utils/clearance/ClearanceManager"));

module.exports = async (client, message, args) => {
	const command = args[1];
	if (!command) return message.channel.send(await client.bulbutils.translate("override_enable_missing_command", message.guild.id));
	const cTemp = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
	if (cTemp === undefined)
		return message.channel.send(await client.bulbutils.translate("override_enable_invalid_command", message.guild.id, { command }));

	await ClearanceManager.enableCommand(message.guild.id, cTemp.name);
	message.channel.send(await client.bulbutils.translate("override_enable_success", message.guild.id, { command }));
};

const ClearanceManager = new (require("../../../utils/clearance/ClearanceManager"));

module.exports = async (client, message, args) => {
	const command = args[1];
	if (!command) return message.channel.send(await client.bulbutils.translate("override_disable_missing_command", message.guild.id));
	const cTemp = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
	if (cTemp === undefined)
		return message.channel.send(await client.bulbutils.translate("override_disable_invalid_command", message.guild.id, { command }));

	await ClearanceManager.disableCommand(message.guild.id, cTemp);

	message.channel.send(await client.bulbutils.translate("override_disable_success", message.guild.id, { command }));
};

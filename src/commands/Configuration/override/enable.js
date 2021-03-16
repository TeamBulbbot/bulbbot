const { EnableCommand } = require("../../../utils/clearance/commands/CommandOverrideUtils");

module.exports = async (client, message, args) => {
	const command = args[1];
	if (!command) return message.channel.send(await client.bulbutils.translate("override_enable_missing_command"));
	const cTemp = client.commands.get(command.toLowerCase()) || client.commands.get(client.aliases.get(command.toLowerCase()));
	if (cTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_enable_invalid_command", { command }));

	await EnableCommand(message.guild.id, cTemp.name);
	message.channel.send(await client.bulbutils.translate("override_enable_success", { command }));
};

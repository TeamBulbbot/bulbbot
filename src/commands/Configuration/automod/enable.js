const { enable } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	await enable(message.guild.id);
	message.channel.send(await client.bulbutils.translate("automod_enabled"));
};

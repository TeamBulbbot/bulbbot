const { enable } = require("../../../utils/AutoModUtils");

module.exports = async (client, message, args) => {
	enable(message.guild.id);
	message.channel.send("enabled automod");
};

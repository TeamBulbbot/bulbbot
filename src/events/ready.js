const clc = require("cli-color");
const Logger = require("../utils/other/winston");

module.exports = (client) => {
	console.log(
		clc.cyan(`
[!] Username: ${client.user.username}
[!] ID: ${client.user.id}
[!] Guild Count: ${client.guilds.cache.size}
[!] Commands: ${client.commands.size}
[!] Bot is online
  `)
	);

	Logger.info("Bot is up and running");

	client.user.setPresence({
		status: "online",
		activity: {
			name: `over ${client.guilds.cache.size} guilds`,
			type: "WATCHING",
		},
	});
};

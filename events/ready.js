var clc = require("cli-color");

module.exports = (client) => {
	console.log(clc.cyan("[!] Bot is online"));

	client.user.setPresence({
		status: "online",
		activity: {
			name: "❤️",
			type: "WATCHING",
		},
	});
};

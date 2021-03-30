const Command = require("../../structures/Command");
const shell = require("shelljs");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Reloads the bot",
			category: "Admin",
			usage: "!reload",
			devOnly: true,
		});
	}

	async run(message) {
		message.channel.send("The bot is shutting down...").then(() => {
			shell.exec("pm2 reload bulbbot");
		});
	}
};

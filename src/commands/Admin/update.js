const Command = require("../../structures/Command");
const shell = require("shelljs");
const path = require("path");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Pulls the latest code from master and reloads the bot",
			category: "Admin",
			usage: "!update",
			devOnly: true,
		});
	}

	async run(message, args) {
		message.channel.send(await this.client.bulbutils.translate("global_loading")).then(msg => {
			const p = path.resolve(__dirname, "");
			shell.cd(`${p}/../../../`);
			const resp = shell.exec("git pull");
			msg.edit(resp.stdout, { code: "yaml" });

			if (resp.stdout !== "Already up to date.\n") {
				message.channel.send("Restarting the bot...").then(() => {
					this.client.destroy();
					shell.exec("npm run start");
				});
			}
		});
	}
};

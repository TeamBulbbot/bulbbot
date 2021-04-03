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
		message.channel.send(await this.client.bulbutils.translate("global_loading", message.guild.id)).then(msg => {
			const p = path.resolve(__dirname, "");
			shell.cd(`${p}/../../../`);
			const resp = shell.exec("pm2 pull bulbbot");
			msg.edit(resp.stdout, { code: "yaml" });
			shell.exec("pm2 restart bulbbot");
		});
	}
};

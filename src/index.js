const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const ascii = require("ascii-table");
const { resolve } = require("path");
const table = new ascii().setHeading("Event", "Status");
const cron = require("node-cron");
const CommandJobs = require("./utils/cronjob/command");

const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.mongoose = require("./utils/database/mongoose");

client.categories = fs.readdirSync(resolve(__dirname, "./commands/"));

config({
	path: `${__dirname}/.env`,
});

["command"].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

fs.readdir(resolve(__dirname, "./events/"), (err, files) => {
	if (err) return console.error;
	files.forEach((file) => {
		if (!file.endsWith(".js")) return;
		const evt = require(`./events/${file}`);
		let evtName = file.split(".")[0];

		table.addRow(evtName, "✅");
		client.on(evtName, evt.bind(null, client));
	});
	console.log(table.toString());
});

// Run this every 30 seconds
cron.schedule("*/30 * * * * *", () => {
	CommandJobs.Mute(client);
	CommandJobs.Remind(client);
});

client.mongoose.init();
client.login(process.env.TOKEN);

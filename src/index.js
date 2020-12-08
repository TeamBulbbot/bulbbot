const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const { resolve } = require("path");
const fs = require("fs");
const db = require("./utils/database/connection");

const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();

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

		client.on(evtName, evt.bind(null, client));
	});
});

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch((err) => console.log("Database connection error: ", err));

client
	.login(process.env.BOT_TOKEN)
	.catch((err) => console.log("Client connection error: ", err));

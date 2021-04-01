const BulbBotClient = require("./structures/BulbBotClient");
const db = require("./utils/database/connection");
const server = require("./utils/prometheus/server");
const Discord = require("discord.js");

// Logging (DO NOT REMOVE)
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

require("./structures/Config");
require("dotenv").config();

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
});

const config = {
	token: process.env.TOKEN,
	prefix: global.config.prefix,
	defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
	clearance: "0",
};

const client = new BulbBotClient(config);

server.init().catch(err => console.log("[SERVER] Connection error: ", err));

db.authenticate()
	.then(() => console.log("[DB] Connecting..."))
	.catch(err => console.log("[DB] Connection error: ", err));

client.login().catch(err => console.log("[CLIENT] Connection error: ", err));
require("./utils/prometheus/Data")(client);

process.on("uncaughtException", function (err) {
	const embed = new Discord.MessageEmbed()
		.setColor("RED")
		.setTitle("New error | Uncaught Exception")
		.addField("Name", err.name, true)
		.addField("Message", err.message, true)
		.addField("String", err.toString(), true)
		.setDescription(
			`
	**Stack Trace**
	\`\`\`${err.stack}\`\`\`		
		`,
		)
		.setTimestamp();
	client.channels.cache.get(global.config.error).send(embed);

	console.error(err);
});

process.on("unhandledRejection", function (err) {
	const embed = new Discord.MessageEmbed()
		.setColor("RED")
		.setTitle("New error | Uncaught Exception")
		.addField("Name", err.name, true)
		.addField("Message", err.message, true)
		.addField("String", err.toString(), true)
		.setDescription(
			`
	**Stack Trace**
	\`\`\`${err.stack}\`\`\`		
		`,
		)
		.setTimestamp();
	client.channels.cache.get(global.config.error).send(embed);

	console.error(err);
});

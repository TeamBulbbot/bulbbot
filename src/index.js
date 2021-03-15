const BulbBotClient = require("./structures/BulbBotClient");
const db = require("./utils/database/connection");
const server = require("./utils/prometheus/server");
const Discord = require("discord.js");
require("./structures/Config");
require("dotenv").config();

const config = {
	token: process.env.TOKEN,
	prefix: global.config.prefix,
	defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearance: "0",
};

const client = new BulbBotClient(config);

server.init().catch(err => console.log("Server connection error: ", err));

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Database connection error: ", err));

client.login().catch(err => console.log("Client connection error: ", err));
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

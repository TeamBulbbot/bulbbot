const BulbBotClient = require("./structures/BulbBotClient");
const db = require("./utils/database/connection");
const server = require("./utils/prometheus/server");

require("dotenv").config();
const config = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearance: "0",
};

const client = new BulbBotClient(config);

server.init().catch(err => console.log("Server connection error: ", err));

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Database connection error: ", err));

client.login().catch(err => console.log("Client connection error: ", err));

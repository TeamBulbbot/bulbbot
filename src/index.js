const BulbBotClient = require("./structures/BulbBotClient")
require("dotenv").config()
const config = {"token": process.env.TOKEN, "prefix": process.env.PREFIX, "defaultPerms": ["SEND_MESSAGES", "VIEW_CHANNEL"], "clearance": "0"}

const client = new BulbBotClient(config)
client.login();
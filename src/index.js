const BulbBotClient = require("./structures/BulbBotClient")
require("dotenv").config()
const config = {"token": process.env.TOKEN, "prefix": process.env.PREFIX}

const client = new BulbBotClient(config)
client.login();
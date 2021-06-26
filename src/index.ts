import * as Config from "./structures/Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
env.config({ path: `${__dirname}/.env` });

const config = {
	token: process.env.TOKEN,
	prefix: Config.prefix,
	defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
};

const client: BulbBotClient = new BulbBotClient(config);

sequelize
	.authenticate()
	.then(() => console.log("[DATABASE] Connecting..."))
	.catch((err: Error) => console.log("[DATABASE] Connection error: ", err))
	.finally(() => console.log("[DATABASE] Database connected successfully"));

client.login().catch(err => {
	console.error(err);
});

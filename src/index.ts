import * as Config from "./Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
env.config({ path: `${__dirname}/.env` });

import i18next from "i18next";
import * as enUS from "./languages/en-US-new.json";

const config = {
	token: process.env.TOKEN,
	prefix: Config.prefix,
	defaultPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
};

const client: BulbBotClient = new BulbBotClient(config);

i18next.init({
	fallbackLng: "en_US",
	resources: {
		en_US: {
			translation: enUS,
		},
	},
});

sequelize
	.authenticate()
	.then(() => client.log.database("[DATABASE] Connecting..."))
	.catch((err: Error) => client.log.error("[DATABASE] Connection error: ", err))
	.finally(() => client.log.info("[DATABASE] Database connected successfully"));

client.login().catch(err => {
	client.log.error(err);
});

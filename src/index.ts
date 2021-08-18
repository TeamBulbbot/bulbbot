import * as Config from "./Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
env.config({ path: `${__dirname}/../src/.env` });

import i18next from "i18next";
import * as enUS from "./languages/en-US.json";

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
	.catch((err: Error) => client.log.error(`[DATABASE] Connection error: ${err.name} | ${err.message} | ${err.stack}`))
	.finally(() => client.log.database("[DATABASE] Database connected successfully"));

client.login().catch((err: Error) => {
	client.log.error(`[CLIENT] Login error: ${err.name} | ${err.message} | ${err.stack}`);
});

process.on("exit", () => {
	client.log.info("Proccess was killed, terminating the client and database connection");

	client.destroy();
	sequelize.close();

	client.log.info("Closed everything <3");
});

process.on("unhandledRejection", (err: Error) => client.log.error(`[PROGRAM] Unhandled Rejection: ${err.name} | ${err.message} | ${err.stack}`));

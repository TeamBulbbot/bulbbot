import * as Config from "./Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
import * as Sentry from "@sentry/node"; // @ts-ignore
import * as Tracing from "@sentry/tracing";

env.config({ path: `${__dirname}/../src/.env` });

import i18next from "i18next";
import * as enUS from "./languages/en-US.json";
import * as skSK from "./languages/sk-SK.json";
import * as svSE from "./languages/sv-SE.json";
import * as csCZ from "./languages/cs-CZ.json";
import * as ptBR from "./languages/pt-BR.json";
import * as frFR from "./languages/fr-FR.json";
import * as itIT from "./languages/it-IT.json";

const config = {
	token: process.env.TOKEN,
	prefix: Config.prefix,
	defaultPerms: Config.defaultPerms,
};

const client: BulbBotClient = new BulbBotClient(config);

i18next.init({
	fallbackLng: "en-US",
	debug: process.env.ENVIRONMENT === "dev",
	resources: {
		"en-US": {
			translation: enUS,
		},
		"pt-BR": {
			translation: ptBR,
		},
		"fr-FR": {
			translation: frFR,
		},
		"sk-SK": {
			translation: skSK,
		},
		"sv-SE": {
			translation: svSE,
		},
		"cs-CZ": {
			translation: csCZ,
		},
		"it-IT": {
			translation: itIT,
		}
	},
});

sequelize
	.authenticate()
	.then(() => client.log.database("[DATABASE] Connecting..."))
	.catch((err: Error) => client.log.error(`[DATABASE] Connection error: ${err.name} | ${err.message} | ${err.stack}`))
	.finally(() => client.log.database("[DATABASE] Database connected successfully"));

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
	sampleRate: 1.0,
	attachStacktrace: true,
	autoSessionTracking: true,
	debug: process.env.ENVIRONMENT === "dev",
	maxBreadcrumbs: 100,
	integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

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

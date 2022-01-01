import * as Config from "./Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
import { init, Integrations } from "@sentry/node"; // @ts-ignore
import * as Tracing from "@sentry/tracing";
import { startAllCrons } from "./utils/Crons";
import { startPrometheus } from "./utils/Prometheus";

env.config({ path: `${__dirname}/../src/.env` });

import i18next from "i18next";
import enUS from "./languages/en-US.json";
import skSK from "./languages/sk-SK.json";
import svSE from "./languages/sv-SE.json";
import csCZ from "./languages/cs-CZ.json";
import ptBR from "./languages/pt-BR.json";
import frFR from "./languages/fr-FR.json";
import itIT from "./languages/it-IT.json";
import hiIN from "./languages/hi-IN.json";

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
		},
		"hi-IN": {
			translation: hiIN,
		},
	},
});

sequelize
	.authenticate()
	.then(() => client.log.database("[DATABASE] Connecting..."))
	.catch((err: Error) => client.log.error(`[DATABASE] Connection error: ${err.name} | ${err.message} | ${err.stack}`))
	.finally(() => client.log.database("[DATABASE] Database connected successfully"));

startAllCrons(client);
if (process.env.ENABLE_LOGGING === "true") startPrometheus(client);

init({
	dsn: process.env.SENTRY_DSN,
	tracesSampleRate: 1.0,
	sampleRate: 1.0,
	attachStacktrace: true,
	autoSessionTracking: true,
	debug: process.env.ENVIRONMENT === "dev",
	maxBreadcrumbs: 100,
	integrations: [new Integrations.Http({ tracing: true })],
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

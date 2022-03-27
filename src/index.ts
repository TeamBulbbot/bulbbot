import * as Config from "./Config";
import BulbBotClient from "./structures/BulbBotClient";
import * as env from "dotenv";
import { sequelize } from "./utils/database/connection";
import { init, Integrations } from "@sentry/node"; // @ts-ignore
import * as Tracing from "@sentry/tracing";
import { startAllCrons } from "./utils/Crons";
import { startPrometheus } from "./utils/Prometheus";
import fs from "fs";
import i18next from "i18next";

env.config({ path: `${__dirname}/../src/.env` });

const config = {
	token: process.env.TOKEN,
	prefix: Config.prefix,
	defaultPerms: Config.defaultPerms,
};

const client: BulbBotClient = new BulbBotClient(config);
const languagesPath = require("path").join(__dirname, "languages");

const resources = {};
fs.readdirSync(languagesPath).map(file => {
	const langName = file.split(".")[0];
	resources[langName] = {
		translation: require(`./languages/${langName}.json`),
	};
});
i18next.init({
	fallbackLng: "en-US",
	debug: process.env.ENVIRONMENT === "dev",
	resources,
});

sequelize
	.authenticate()
	.then(() => client.log.database("[DATABASE] Connecting..."))
	.catch((err: Error) => client.log.error(`[DATABASE] Connection error: ${err.name} | ${err.message} | ${err.stack}`))
	.finally(() => client.log.database("[DATABASE] Database connected successfully"));

startAllCrons(client);
if (process.env.ENABLE_LOGGING === "true") startPrometheus(client);

if (process.env.ENABLE_SENTRY === "true")
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
	client.log.info("Process was killed, terminating the client and database connection");

	client.destroy();
	sequelize.close();

	client.log.info("Closed everything <3");
});

process.on("unhandledRejection", (err: Error) => client.log.error(`[PROGRAM] Unhandled Rejection: ${err.name} | ${err.message} | ${err.stack}`));

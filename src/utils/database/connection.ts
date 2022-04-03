import { Sequelize } from "sequelize";
import * as env from "dotenv";
import applyExtra from "./applyExtra";
env.config({ path: `${__dirname}/../../../src/.env` });

if (typeof process.env.DB_NAME !== "string" || typeof process.env.DB_USER !== "string" || typeof process.env.DB_PASSWORD !== "string") {
	throw new Error("process.env is missing required DB environment variables (is your .env configured correctly?)");
}

export const sequelize: Sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: "postgres",
	logging: false,
	logQueryParameters: true,
	benchmark: true,
	pool: {
		max: 5, // max connections
		min: 0, // min connections
		idle: 30000, // The maximum time, in milliseconds, that a connection can be idle before being released.
		acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
	},
});

const models: any[] = [
	require("./models/AutoMod").default,
	require("./models/Guild").default,
	require("./models/GuildLogging").default,
	require("./models/GuildConfiguration").default,
	require("./models/GuildModerationRoles").default,
	require("./models/GuildOverrideCommands").default,
	require("./models/Infraction").default,
	require("./models/Tempban").default,
	require("./models/Blacklist").default,
	require("./models/Remind").default,
	require("./models/Banpools").default,
	require("./models/BanpoolSubscribers").default,
	require("./models/MessageLogs").default,
	require("./models/Experiment").default,
];

for (const modelDefiner of models) modelDefiner(sequelize);
applyExtra(sequelize);

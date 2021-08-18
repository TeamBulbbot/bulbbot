import { createLogger, format, transports, addColors } from "winston";
const { combine, timestamp, colorize, padLevels, printf } = format;

const levels = {
	levels: {
		error: 0,
		warn: 1,
		info: 2,

		client: 3,
		database: 4,

		debug: 5,
	},
	colors: {
		error: "red",
		warn: "yellow",
		info: "blue",

		client: "magenta",
		database: "cyan",

		debug: "blue",
	},
};

addColors(levels.colors);
export const logger = createLogger({
	levels: levels.levels,
	transports: [
		new transports.Console({ level: "database" }),

		new transports.File({ filename: `./logs/${new Date().toLocaleDateString()}-combined.log`, level: "debug" }),
		new transports.File({ filename: `./logs/info/${new Date().toLocaleDateString()}-info.log`, level: "info" }),
		new transports.File({ filename: `./logs/warn/${new Date().toLocaleDateString()}-warn.log`, level: "warn" }),
		new transports.File({ filename: `./logs/error/${new Date().toLocaleDateString()}-error.log`, level: "error" }),
		new transports.File({ filename: `./logs/client/${new Date().toLocaleDateString()}-client.log`, level: "client" }),
		new transports.File({ filename: `./logs/database/${new Date().toLocaleDateString()}-database.log`, level: "database" }),
	],
	format: combine(
		colorize(),
		padLevels({ levels: levels.levels }),
		timestamp(),
		printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
	),

	exitOnError: false,
});

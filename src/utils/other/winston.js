const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
	format: format.combine(
		format.simple(),
		format.timestamp(),
		format.printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
	),
	transports: [
		new transports.File({
			maxsize: 5242880,
			maxFiles: 5,
			filename: `${__dirname}/../../logs/log.log`,
		}),
		new transports.Console({
			level: "debug",
			handleExceptions: true,
			json: false,
			colorize: true,
		}),
	],
});

const { Sequelize } = require("sequelize");
const { ApplyExtra } = require("./applyExtra");
const { config } = require("dotenv");

config({
	path: `./src/.env`,
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
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

const models = [
	require("./models/guild.js"),
	require("./models/guildConfiguration"),
	require("./models/guildLogging"),
	require("./models/guildModerationRoles"),
	require("./models/guildOverrideCommands"),
	require("./models/infraction"),
	require("./models/starboard"),
	require("./models/starboardPost"),
	require("./models/tempban"),
];

for (const modelDefiner of models) modelDefiner(sequelize);
ApplyExtra(sequelize);

module.exports = sequelize;

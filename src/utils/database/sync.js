const sequelize = require("./connection");

async function sync() {
	const start = new Date().getTime();
	console.log("[DB] Starting database sync...");

	//await sequelize.sync();
	await sequelize.sync({ alter: true });

	const end = new Date().getTime();

	console.log(`\n[DB] Database sync done, it took ${end - start} ms!`);
}

sync();

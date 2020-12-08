const sequelize = require("./connection");

async function sync() {
	const start = new Date().getTime();
	console.log("Starting database sync...");

	//await sequelize.sync();
	await sequelize.sync({ force: true });
	const end = new Date().getTime();

	console.log(`\nDatabase sync done, it took ${end - start} ms!`);
}

sync();

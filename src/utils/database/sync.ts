import { sequelize } from "./connection";

async function sync(): Promise<void> {
	const start: number = new Date().getTime();
	console.log("[DB] Starting database sync...");

	await sequelize.sync({
		alter: true,
		//force: true,
		logging: true,
		benchmark: true,
	});

	const end: number = new Date().getTime();

	console.log(`\n[DB] Database sync done, it took ${end - start} ms!`);
}

sync();

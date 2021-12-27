import { schedule } from "node-cron";
import BulbBotClient from "../structures/BulbBotClient";
import DatabaseManager from "./managers/DatabaseManager";
import { readdirSync, unlinkSync } from "fs";
import { join } from "path";

const { purgeAllMessagesOlderThan30Days }: DatabaseManager = new DatabaseManager();

export function startAllCrons(client: BulbBotClient) {
	client.log.info("[CRONS] Starting up the crons");
	schedule("0 0 * * *", async () => {
		client.log.info("[CRONS] Starting to clear up messages");
		const count = await purgeAllMessagesOlderThan30Days();
		let fileCount: number = 0;
		const path: string = `${__dirname}/../../files`;
		const files: string[] = readdirSync(path);
		for (const file of files) {
			if (file.endsWith(".gitignore")) continue;
			fileCount++;
			unlinkSync(join(path, file));
		}

		client.log.info(`[CRONS] Cleared ${count} messages and deleted ${fileCount} files`);
	});
}

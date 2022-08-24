import { schedule } from "node-cron";
import BulbBotClient from "../structures/BulbBotClient";
import DatabaseManager from "./managers/DatabaseManager";
import { readdir, unlink } from "fs/promises";
import { join } from "path";
import { unpackSettled } from "./helpers";
import { filesDir } from "..";

const { purgeAllMessagesOlderThan30Days }: DatabaseManager = new DatabaseManager();

export function startAllCrons(client: BulbBotClient) {
	client.log.info("[CRONS] Starting cron jobs");
	schedule("0 0 * * *", async () => {
		client.log.info("[CRONS] Starting to clear up messages");
		const count = await purgeAllMessagesOlderThan30Days();
		const files: string[] = await readdir(filesDir);
		const operations = files.map(async (file) => {
			if (file.endsWith(".gitignore")) return;
			await unlink(join(filesDir, file));
			return true;
		});
		const resolvedOperations = unpackSettled(await Promise.allSettled(operations)).filter(Boolean) as true[];

		client.log.info(`[CRONS] Cleared ${count} messages and deleted ${resolvedOperations.length} files`);
	});
}

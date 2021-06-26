import BulbBotClient from "./BulbBotClient";
import { DMChannel, Guild, Message, Snowflake } from "discord.js";
import AutoModManager from "../utils/managers/AutoModManager";
import LoggingManager from "../utils/managers/LoggingManager";
import DatabaseManager from "../utils/managers/DatabaseManager";

const automodManager: AutoModManager = new AutoModManager();
const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

let cache = {};

export async function set(client: BulbBotClient, message: Message, guild: Snowflake, category: "mentions" | "messages", user: Snowflake, value: number, timeout: number = 10000): Promise<void> {
	if (cache[guild] === undefined) cache[guild] = { mentions: {}, messages: {} };

	if (!cache[guild][category][user]) cache[guild][category][user] = { count: value, time: Date.now() };
	else cache[guild][category][user]["count"] = cache[guild][category][user]["count"] + value;

	const dbGuild = await databaseManager.getAutoModConfig(guild);

	const messageLimit = dbGuild["limitMessages"];
	const mentionsLimit = dbGuild["limitMentions"];

	if (cache[guild]["messages"][user] && cache[guild]["messages"][user]["count"] >= messageLimit && messageLimit !== 0) {
		if (!(message.channel instanceof DMChannel)) {
			await automodManager.resolveAction(
				client,
				message,
				dbGuild["punishmentMessages"],
				await client.bulbutils.translate("automod_violation_max_messages_reason", message.guild?.id, {
					channel_name: message.channel.name,
					amount: cache[guild]["messages"][user]["count"],
					limit: dbGuild["timeoutMessages"],
				}),
			);
		}
		await loggingManager.sendAutoModLog(
			client,
			<Guild>message.guild,
			await client.bulbutils.translate("automod_violation_max_messages_log", message.guild?.id, {
				target_tag: message.author.tag,
				target_id: message.author.id,
				channel_id: message.channel.id,
				amount: cache[guild]["messages"][user]["count"],
				limit: (Date.now() - cache[guild]["messages"][user]["time"]) / 1000,
			}),
		);
		delete cache[guild]["messages"][user];
	}
	if (cache[guild]["mentions"][user] && cache[guild]["mentions"][user]["count"] >= mentionsLimit && mentionsLimit !== 0) {
		if (!(message.channel instanceof DMChannel)) {
			await automodManager.resolveAction(
				client,
				message,
				dbGuild["punishmentMentions"],
				await client.bulbutils.translate("automod_violation_max_mentions_reason", message.guild?.id, {
					channel_name: message.channel.name,
					amount: cache[guild]["mentions"][user]["count"],
					limit: dbGuild["timeoutMentions"],
				}),
			);
		}
		await loggingManager.sendAutoModLog(
			client,
			<Guild>message.guild,
			await client.bulbutils.translate("automod_violation_max_mentions_log", message.guild?.id, {
				target_tag: message.author.tag,
				target_id: message.author.id,
				channel_id: message.channel.id,
				amount: cache[guild]["mentions"][user]["count"],
				limit: (Date.now() - cache[guild]["mentions"][user]["time"]) / 1000,
			}),
		);
		delete cache[guild]["mentions"][user];
	}

	setTimeout(function () {
		if (cache[guild] === undefined || cache[guild][category] === undefined || cache[guild][category][user] === undefined) return;

		cache[guild][category][user]["count"] = cache[guild][category][user]["count"] - value;
		cache[guild][category][user]["time"] = Date.now();
		if (cache[guild][category][user]["count"] <= 0) delete cache[guild][category][user];
		if (Object.keys(cache[guild]["messages"]).length === 0 && Object.keys(cache[guild]["mentions"]).length === 0) delete cache[guild];
	}, timeout);
}

export function getAll(): Object {
	return cache;
}

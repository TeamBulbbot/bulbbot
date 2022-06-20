import BulbBotClient from "./BulbBotClient";
import { DMChannel, Snowflake } from "discord.js";
import AutoModManager from "../utils/managers/AutoModManager";
import LoggingManager from "../utils/managers/LoggingManager";
import DatabaseManager from "../utils/managers/DatabaseManager";
import CommandContext from "./CommandContext";

const automodManager: AutoModManager = new AutoModManager();
const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

const cache = {};

export async function set(client: BulbBotClient, context: CommandContext, guild: Snowflake, category: "mentions" | "messages", user: Snowflake, value: number, timeout = 10000): Promise<void> {
	if (!context.guild) return;
	if (cache[guild] === undefined) cache[guild] = { mentions: {}, messages: {} };

	if (!cache[guild][category][user]) cache[guild][category][user] = { count: value, time: Date.now() };
	else cache[guild][category][user]["count"] = cache[guild][category][user]["count"] + value;

	const dbGuild = await databaseManager.getAutoModConfig(context.guild);

	const messageLimit = dbGuild.limitMessages || 0;
	const mentionsLimit = dbGuild.limitMentions || 0;

	if (cache[guild]["messages"][user] && cache[guild]["messages"][user]["count"] >= messageLimit && messageLimit !== 0) {
		if (!(context.channel instanceof DMChannel) && "name" in context.channel) {
			await automodManager.resolveAction(
				client,
				context,
				dbGuild.punishmentMessages,
				await client.bulbutils.translate("automod_violation_max_messages_reason", context.guild.id, {
					channel: context.channel,
					amount: cache[guild]["messages"][user]["count"],
					limit: dbGuild.timeoutMessages,
				}),
			);
		}
		await loggingManager.sendAutoModLog(
			client,
			context.guild,
			await client.bulbutils.translate("automod_violation_max_messages_log", context.guild.id, {
				target: context.author,
				channel: context.channel,
				amount: cache[guild]["messages"][user]["count"],
				limit: (Date.now() - cache[guild]["messages"][user]["time"]) / 1000,
			}),
		);
		delete cache[guild]["messages"][user];
	}
	if (cache[guild]["mentions"][user] && cache[guild]["mentions"][user]["count"] >= mentionsLimit && mentionsLimit !== 0) {
		if (!(context.channel instanceof DMChannel) && "name" in context.channel) {
			await automodManager.resolveAction(
				client,
				context,
				dbGuild.punishmentMentions,
				await client.bulbutils.translate("automod_violation_max_mentions_reason", context.guild.id, {
					channel: context.channel,
					amount: cache[guild]["mentions"][user]["count"],
					limit: dbGuild.timeoutMentions,
				}),
			);
		}
		await loggingManager.sendAutoModLog(
			client,
			context.guild,
			await client.bulbutils.translate("automod_violation_max_mentions_log", context.guild.id, {
				target: context.author,
				channel: context.channel,
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

export function getAll(): Record<string, any> {
	return cache;
}

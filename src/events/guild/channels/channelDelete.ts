import { DMChannel, GuildAuditLogs, GuildChannel, Permissions } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(channel: DMChannel | GuildChannel) {
		if (!(channel instanceof GuildChannel)) return;

		const { guildLogging: config } = await databaseManager.getCombinedLoggingConfig(channel.guild);
		const field = Object.keys(config).find((key) => config[key] === channel.id) as keyof typeof config;
		if (field) {
			databaseManager.updateConfig({
				guild: channel.guild,
				table: "guildLogging",
				field,
				value: null,
			});
		}

		let log = "";
		if (channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			const logs: GuildAuditLogs<"CHANNEL_DELETE"> = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_DELETE" });
			const first = logs.entries.first();
			if (first) {
				const { executor, createdTimestamp } = first;
				if (Date.now() < createdTimestamp + 3000)
					log = await this.client.bulbutils.translate("event_channel_delete_moderator", channel.guild.id, {
						channel,
						moderator: executor || { id: "Unknown ID", tag: "Unknown User" },
						// @ts-expect-error
						type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
					});
			}
		}

		if (!log)
			log = await this.client.bulbutils.translate("event_channel_delete", channel.guild.id, {
				channel,
				// @ts-expect-error
				type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
			});

		await loggingManager.sendEventLog(this.client, channel.guild, "channel", log);
	}
}

import { GuildAuditLogs, GuildScheduledEvent, Permissions } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	async run(newScheduledEvent: GuildScheduledEvent) {
		if (!newScheduledEvent.guild?.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const logs: GuildAuditLogs<"GUILD_SCHEDULED_EVENT_CREATE"> = await newScheduledEvent.guild.fetchAuditLogs({ limit: 1, type: "GUILD_SCHEDULED_EVENT_CREATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (Date.now() < createdTimestamp + 3000) return;
		if (!changes) return;

		const log: string[] = [];

		for (const change of changes) {
			log.push(
				await this.client.bulbutils.translate("event_change", newScheduledEvent.guild.id, {
					part: change.key,
					before: change.old ? change.old : "none",
					after: change.new ? change.new : "none",
				}),
			);
		}

		await loggingManager.sendEventLog(
			this.client,
			newScheduledEvent.guild,
			"other",
			await this.client.bulbutils.translate("event_update_scheduled_event", newScheduledEvent.guild.id, {
				moderator: executor || { id: "Unknown ID", tag: "Unknown User" },
				event: newScheduledEvent,
				changes: log.join("\n> "),
			}),
		);
	}
}

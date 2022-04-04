import { GuildAuditLogs, GuildScheduledEvent, Permissions } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(scheduledEvent: GuildScheduledEvent) {
		if (!scheduledEvent.guild?.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		let msg = "";
		const logs: GuildAuditLogs<"GUILD_SCHEDULED_EVENT_DELETE"> = await scheduledEvent.guild?.fetchAuditLogs({ limit: 1, type: "GUILD_SCHEDULED_EVENT_DELETE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, createdTimestamp } = first;
		if (Date.now() < createdTimestamp + 3000) {
			msg = await this.client.bulbutils.translate("event_guild_scheduled_event_delete_moderator", scheduledEvent.guild?.id, {
				scheduledEvent,
				moderator: executor,
			});
		}

		if (!msg)
			msg = await this.client.bulbutils.translate("event_guild_scheduled_event_delete", scheduledEvent.guild?.id, {
				scheduledEvent,
			});

		await loggingManager.sendEventLog(this.client, scheduledEvent.guild!, "other", msg);
	}
}

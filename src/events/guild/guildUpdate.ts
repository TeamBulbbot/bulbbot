import Event from "../../structures/Event";
import { Guild, GuildAuditLogs, Permissions } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(newGuild: Guild): Promise<void> {
		if (!newGuild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const logs: GuildAuditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: "GUILD_UPDATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 5000 < Date.now()) return;
		if (!changes?.length) return;

		const log: string[] = [];

		for (const change of changes) {
			log.push(
				await this.client.bulbutils.translate("event_change", newGuild.id, {
					part: change.key,
					before: change.old || "none",
					after: change.new || "none",
				}),
			);
		}

		await loggingManager.sendEventLog(
			this.client,
			newGuild,
			"other",
			await this.client.bulbutils.translate("event_update_server", newGuild.id, {
				moderator: executor,
				changes: log.join(", "),
			}),
		);
	}
}

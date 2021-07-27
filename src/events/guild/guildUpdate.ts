import Event from "../../structures/Event";
import { Guild, GuildAuditLogs } from "discord.js";
import LoggingManager from "../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(newGuild: Guild): Promise<void> {
		if (!newGuild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const logs: GuildAuditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: "GUILD_UPDATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 5000 < Date.now()) return;
		if (!changes) return;

		const log: string[] = [];

		for (const change of changes) {
			log.push
				(await this.client.bulbutils.translate("event_change", newGuild.id, {
					part: change.key,
					before: change.old || null,
					after: change.new || null,
				}));
		}

		await loggingManager.sendServerEventLog(
			this.client,
			newGuild,
			await this.client.bulbutils.translate("event_server_update", newGuild.id, {
				moderator_tag: executor.tag,
				moderator_id: executor.id,
				changes: log.join(", "),
			}),
		);
	}
}

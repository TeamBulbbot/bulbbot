import Event from "../../../structures/Event";
import { GuildAuditLogs, Role } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(newRole: Role): Promise<void> {
		if (!newRole.guild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const logs: GuildAuditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (!changes) return;

		let log: string[] = [];

		for (const change of changes) {
			log.push
				(await this.client.bulbutils.translateNew("event_change", newRole.guild.id, {
					part: change.key,
					before: change.old ? change.old : "none",
					after: change.new ? change.new : "none",
				}));
		}

		await loggingManager.sendServerEventLog(
			this.client,
			newRole.guild,
			await this.client.bulbutils.translateNew("event_update_role", newRole.guild.id, {
				moderator: executor,
				role: newRole,
				changes: log.join(", "),
			}),
		);
	}
}

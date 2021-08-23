// @ts-nocheck

import Event from "../../../structures/Event";
import { GuildAuditLogs, Permissions, Role } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(newRole: Role): Promise<void> {
		return; // There's a big bug where creating a role and immediately modifying it will spam this event, one for every role in the guild
		if (!newRole.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const logs: GuildAuditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (!changes || !changes.length) return;
		let log: string[] = [];

		for (const change of changes) {
			log.push(
				await this.client.bulbutils.translate("event_change", newRole.guild.id, {
					part: change.key,
					before: change.old ? change.old : "none",
					after: change.new ? change.new : "none",
				}),
			);
		}

		await loggingManager.sendEventLog(
			this.client,
			newRole.guild,
			"role",
			await this.client.bulbutils.translate("event_update_role", newRole.guild.id, {
				moderator: executor,
				role: newRole,
				changes: log.join(", "),
			}),
		);
	}
}

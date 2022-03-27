// @ts-nocheck

import Event from "../../../structures/Event";
import { GuildAuditLogs, GuildMember, Role } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(oldRole: Role, newRole: Role): Promise<void> {
		const config: GuildConfiguration = await databaseManager.getConfig(newRole.guild.id);
		if (newRole.rawPosition > newRole.guild.me!.roles.highest.rawPosition) {
			if (newRole.id === config.muteRole) await databaseManager.setMuteRole(newRole.guild.id, null)
			else if (newRole.id === config.autorole) await databaseManager.setAutoRole(newRole.guild.id, null)
		}

		const difference = this.client.bulbutils.diff(oldRole, newRole).filter(k => k !== "rawPosition");
		if (difference.length === 0) return;

		let executor: GuildMember | null = null;
		let changes: any[] | null = null;
		let createdTimestamp: number | null = null;
		const log: string[] = [];
		try {
			const logs: GuildAuditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
			const first = logs.entries.first();
			if (!first) return;

			executor = first.executor;
			createdTimestamp = first.createdTimestamp;
			changes = first.changes;
			// if (createdTimestamp + 3000 < Date.now()) return;
		} catch (_) {
			changes = [];
			for (const key of difference) {
				changes.push({ key, old: oldRole[key], new: newRole[key] });
			}
		}

		if (!changes || !changes.length) return;
		for (const change of changes) {
			log.push(
				await this.client.bulbutils.translate("event_change", newRole.guild.id, {
					part: change.key,
					before: change.old ? change.old : "none",
					after: change.new ? change.new : "none",
				}),
			);
		}

		if (executor) {
			await loggingManager.sendEventLog(
				this.client,
				newRole.guild,
				"role",
				await this.client.bulbutils.translate("event_update_role_moderator", newRole.guild.id, {
					moderator: executor,
					role: newRole,
					changes: log.join("\n> "),
				}),
			);
		} else {
			await loggingManager.sendEventLog(
				this.client,
				newRole.guild,
				"role",
				await this.client.bulbutils.translate("event_update_role", newRole.guild.id, {
					role: newRole,
					changes: log.join("\n> "),
				}),
			);
		}
	}
}

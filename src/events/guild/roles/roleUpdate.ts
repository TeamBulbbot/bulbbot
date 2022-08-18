import Event from "../../../structures/Event";
import { User, Role } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

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
		const config = await databaseManager.getConfig(newRole.guild);
		if (newRole.rawPosition > (newRole.guild.me?.roles.highest.rawPosition ?? Infinity)) {
			if (newRole.id === config.autorole) await databaseManager.updateConfig({ table: "guildConfiguration", field: "autorole", value: null, guild: newRole.guild });
		}

		const difference = this.client.bulbutils.diff(oldRole, newRole).filter((k) => k !== "rawPosition");
		if (difference.length === 0) return;

		let executor: Nullable<User> = null;
		let changes: Nullable<any[]> = null;
		// let createdTimestamp: number | null = null;
		const log: string[] = [];
		try {
			const logs = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
			const first = logs.entries.first();
			if (!first) return;

			executor = first.executor;
			// createdTimestamp = first.createdTimestamp;
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

import Event from "../../../structures/Event";
import { GuildAuditLogsEntry, Role} from "discord.js";
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

		const logs = await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_UPDATE" });
		const first: GuildAuditLogsEntry = <GuildAuditLogsEntry>logs.entries.first();

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (!changes) return;

		let log: string = "";

		for (const change of changes) {
			log +=
				(await this.client.bulbutils.translate("event_change", newRole.guild.id, {
					part: change.key,
					before: change.old ? change.old : null,
					after: change.new ? change.new : null,
				})) + ", ";
		}

		log = log.replace(/, +$/, "");

		await loggingManager.sendServerEventLog(
			this.client,
			newRole.guild,
			await this.client.bulbutils.translate("event_role_update", newRole.guild.id, {
				moderator_tag: executor.tag,
				moderator_id: executor.id,
				role: newRole.name,
				changes: log,
			}),
		);
	}
}

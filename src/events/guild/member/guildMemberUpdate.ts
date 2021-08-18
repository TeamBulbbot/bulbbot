import Event from "../../../structures/Event";
import { DiscordAPIError, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, User, Util, Permissions } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(oldMember: GuildMember, newMember: GuildMember) {
		let autoRoleName: string | null;
		if (oldMember.pending && !newMember.pending && (autoRoleName = (await databaseManager.getConfig(newMember.guild.id))["autorole"]) !== null) await newMember.roles.add(autoRoleName);

		let change: "newrole" | "removedrole" | "nickname";
		let message: string;
		let audit: GuildAuditLogs;
		let auditLog: GuildAuditLogsEntry | undefined;
		let executor: User;

		if (oldMember.roles.cache.size < newMember.roles.cache.size) change = "newrole";
		else if (oldMember.roles.cache.size > newMember.roles.cache.size) change = "removedrole";
		else if (oldMember.nickname !== newMember.nickname) change = "nickname";
		else return;

		if (newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			try {
				switch (change) {
					case "newrole":
					case "removedrole":
						audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
						break;
					default:
						audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" });
						break;
				}
				auditLog = audit.entries.first();
			} catch (e) {
				if (!(e instanceof DiscordAPIError)) throw e;
			}
		}
		switch (change) {
			case "nickname":
				if (auditLog?.changes && auditLog.changes[0].key === "nick") executor = <User>auditLog.executor;
				message = await this.client.bulbutils.translate("event_member_update_nickname", newMember.guild.id, {
					user: newMember.user,
					before: oldMember.nickname ?? oldMember.user.username,
					after: newMember.nickname ?? newMember.user.username,
					// executor?
				});
				break;
			case "newrole":
			case "removedrole":
				const diff = newMember.roles.cache.difference(oldMember.roles.cache);
				const role = diff.first();
				if (!role) return;

				if (auditLog) {
					const translateKey = change === "newrole" ? "event_member_update_role_add_moderator" : "event_member_update_role_remove_moderator";
					executor = <User>auditLog.executor;
					message = await this.client.bulbutils.translate(translateKey, newMember.guild.id, {
						user: newMember.user,
						role,
						moderator: executor,
					});
				} else {
					const translateKey = change === "newrole" ? "event_member_update_role_add" : "event_member_update_role_remove";
					message = await this.client.bulbutils.translate(translateKey, newMember.guild.id, {
						user: newMember.user,
						role,
						// executor,
					});
				}
				break;
		}

		await loggingManager.sendServerEventLog(this.client, newMember.guild, Util.removeMentions(message));
	}
}

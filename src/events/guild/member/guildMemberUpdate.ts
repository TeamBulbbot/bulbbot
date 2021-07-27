import Event from "../../../structures/Event";
import { DiscordAPIError, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, User, Util } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
// import InfractionsManager from "../../../utils/managers/InfractionsManager";
// import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
// const infractionsManager: InfractionsManager = new InfractionsManager();
// const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(oldMember: GuildMember, newMember: GuildMember) {
		// let autoRoleName: string | null;
		// if (oldMember.pending && !newMember.pending && (autoRoleName = await databaseManager.getAutoRole(newMember.guild.id)) !== null)
		//	  newMember.roles.add(autoRoleName);

		let change: "newrole" | "removedrole" | "nickname";
		let message: string;
		let audit: GuildAuditLogs
		let auditLog: GuildAuditLogsEntry | undefined;
		let executor: User;

		if (oldMember.roles.cache.size > newMember.roles.cache.size) change = "newrole";
		else if (oldMember.roles.cache.size < newMember.roles.cache.size) change = "removedrole";
		else if (oldMember.nickname !== newMember.nickname) change = "nickname";
		else return;


		if (newMember.guild.me?.hasPermission("VIEW_AUDIT_LOG")) {
			try {
				audit = (await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" }));
				auditLog = audit.entries.first();
			} catch (e) {
				if(!(e instanceof DiscordAPIError)) throw e;
			}
		}
		switch(change)
		{
			case "nickname":
				if (auditLog?.changes && auditLog.changes[0].key === "nick") executor = auditLog.executor;
				message = await this.client.bulbutils.translate("event_member_update_nickname", newMember.guild.id, {
					user_tag: newMember.user.tag,
					user_id: newMember.user.id,
					nick_old: oldMember.nickname ?? oldMember.user.username,
					nick_new: newMember.nickname ?? newMember.user.username,
					// executor?
				});
				break;
			case "newrole":
			case "removedrole":
				const diff = newMember.roles.cache.difference(oldMember.roles.cache);
				const role = diff.first();
				if (!role) return;

				if (auditLog) {
					const translateKey: string = (change === "newrole") ? "event_member_update_role_add_audit"
																		: "event_member_update_role_remove_audit";
					executor = auditLog.executor;
					message = await this.client.bulbutils.translate(translateKey, newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
						moderator_tag: executor.tag,
						moderator_id: executor.id,
					});
				} else {
					const translateKey: string = (change === "newrole") ? "event_member_update_role_add"
																		: "event_member_update_role_remove";
					message = await this.client.bulbutils.translate(translateKey, newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
					});
				}
				break;
		}

		await loggingManager.sendServerEventLog(
			this.client,
			newMember.guild,
			Util.removeMentions(message)
		);
	}
}

import Event from "../../../structures/Event";
import { DiscordAPIError, GuildAuditLogs, GuildAuditLogsEntry, GuildMember, Permissions, Snowflake, User } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import InfractionsManager from "../../../utils/managers/InfractionsManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(oldMember: GuildMember, newMember: GuildMember) {
		let autoRoleName: string | null;
		if (oldMember.pending && !newMember.pending && (autoRoleName = (await databaseManager.getConfig(newMember.guild.id))["autorole"]) !== null) await newMember.roles.add(autoRoleName);

		let change: "newrole" | "removedrole" | "nickname";
		let part: "member" | "role" | "modAction";
		let message: string;
		let audit: GuildAuditLogs<"MEMBER_ROLE_UPDATE"> | GuildAuditLogs<"MEMBER_UPDATE">;
		let auditLog: GuildAuditLogsEntry<"MEMBER_ROLE_UPDATE"> | undefined | GuildAuditLogsEntry<"MEMBER_UPDATE">;
		let executor: User | null = null;

		if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
			if (!newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
			audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
			auditLog = audit.entries.first();
			executor = auditLog ? auditLog.executor : null;

			// If newMember is muted check if the executor is bot. If not, log as manual mute
			// If newMember is not muted check if the executor is bot. If not, log as manual unmute, else log as auto mute
			if (newMember.communicationDisabledUntilTimestamp === null) {
				if (executor?.id !== this.client.user?.id) {
					await infractionsManager.createInfraction(
						newMember.guild.id,
						"Unmute",
						false,
						auditLog?.reason ? <string>auditLog?.reason : await this.client.bulbutils.translate("global_no_reason", newMember.guild.id, {}),
						newMember.user,
						<User>executor,
					);
					const infID: number = await infractionsManager.getLatestInfraction(newMember.guild.id, <Snowflake>executor?.id, newMember.user.id, "Unmute");
					await loggingManager.sendModAction(
						this.client,
						newMember.guild?.id,
						await this.client.bulbutils.translate("mod_action_types.unmute", newMember.guild.id, {}),
						newMember.user,
						<User>executor,
						auditLog?.reason ? <string>auditLog?.reason : await this.client.bulbutils.translate("global_no_reason", newMember.guild.id, {}),
						infID,
					);
				}
			} else {
				if (executor?.id === this.client.user?.id) return;

				await infractionsManager.createInfraction(
					newMember.guild.id,
					"Mute",
					<number>newMember.communicationDisabledUntilTimestamp!,
					auditLog?.reason ? <string>auditLog?.reason : await this.client.bulbutils.translate("global_no_reason", newMember.guild.id, {}),
					newMember.user,
					<User>executor,
				);
				const infID: number = await infractionsManager.getLatestInfraction(newMember.guild.id, <Snowflake>executor?.id, newMember.user.id, "Mute");
				await loggingManager.sendModActionTemp(
					this.client,
					newMember.guild,
					await this.client.bulbutils.translate("mod_action_types.mute", newMember.guild.id, {}),
					newMember.user,
					<User>executor,
					auditLog?.reason ? <string>auditLog?.reason : await this.client.bulbutils.translate("global_no_reason", newMember.guild.id, {}),
					infID,
					newMember.communicationDisabledUntilTimestamp,
				);
			}
		}

		if (oldMember.roles.cache.size < newMember.roles.cache.size) change = "newrole";
		else if (oldMember.roles.cache.size > newMember.roles.cache.size) change = "removedrole";
		else if (oldMember.nickname !== newMember.nickname) change = "nickname";
		else return;

		if (newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			try {
				switch (change) {
					case "newrole":
					case "removedrole":
						audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" });
						break;
					default:
						audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });
						break;
				}
				auditLog = audit.entries.first();
				if (<number>auditLog?.createdTimestamp + 3000 < Date.now()) auditLog = undefined;
				if (!auditLog?.executor) auditLog = undefined;
			} catch (e) {
				if (!(e instanceof DiscordAPIError)) throw e;
			}
		}
		switch (change) {
			case "nickname":
				part = "member";
				if (auditLog?.changes && auditLog!.changes[0].key === "nick") {
					executor = auditLog.executor;
					if (executor?.id === this.client.user!.id) return;

					const reason = auditLog.reason ?? (await this.client.bulbutils.translate("global_no_reason", newMember.guild.id, {}));
					if (!executor?.bot && executor?.id !== newMember.user.id) await infractionsManager.createInfraction(newMember.guild.id, "Manual Nickname", true, reason, newMember.user, executor!);
					const infID: number =
						!executor?.bot && executor?.id !== newMember.user.id ? await infractionsManager.getLatestInfraction(newMember.guild.id, executor!.id, newMember.user.id, "Manual Nickname") : -1;
					const translateKey =
						executor === null || executor.id === newMember.id
							? newMember.nickname
								? "event_member_update_nickname"
								: "event_member_remove_nickname"
							: executor?.bot
							? newMember.nickname
								? "event_member_update_nickname_moderator"
								: "event_member_remove_nickname_moderator"
							: newMember.nickname
							? "nickname_mod_log"
							: "nickname_remove_mod_log";
					part = translateKey.startsWith("event") ? "member" : "modAction";
					message = await this.client.bulbutils.translate(translateKey, newMember.guild.id, {
						user: newMember.user,
						before: oldMember.nickname ?? "none",
						after: newMember.nickname ?? "none",
						nick_old: oldMember.nickname ?? "none",
						nick_new: newMember.nickname ?? "none",
						infraction_id: infID,
						reason,
						action: await this.client.bulbutils.translate(newMember.nickname ? "mod_action_types.nick_change" : "mod_action_types.nick_remove", newMember.guild.id, {}),
						target: newMember.user,
						moderator: executor,
					});
				} else {
					message = await this.client.bulbutils.translate(`event_member_${newMember.nickname ? "update" : "remove"}_nickname`, newMember.guild.id, {
						user: newMember.user,
						before: oldMember.nickname ?? "none",
						after: newMember.nickname ?? "none",
					});
				}
				break;
			case "newrole":
			case "removedrole":
				part = "role";
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
					});
				}
				break;
		}

		await loggingManager.sendEventLog(this.client, newMember.guild, part!, message);
	}
}

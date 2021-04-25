const Event = require("../structures/Event");
const { SendModActionPreformatted, SendEventLog } = require("../utils/moderation/log");
const { createInfraction } = require(`../utils/InfractionUtils`);
const { Util } = require("discord.js");
const DatabaseManager = new (require("../utils/database/DatabaseManager"))();

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMember, newMember) {
		if (oldMember.pending && !newMember.pending && (await DatabaseManager.getAutoRole(newMember.guild)) !== null)
			newMember.roles.add(newMember.guild.roles.cache.get(await DatabaseManager.getAutoRole(newMember.guild)));

		let change = "";

		if (oldMember._roles.length !== newMember._roles.length)
			oldMember._roles.length < newMember._roles.length ? (change = "newrole") : (change = "removedrole");
		else if (oldMember.nickname !== newMember.nickname) change = "nickname";
		else return;

		let message = "";
		let role;
		let audit;
		let auditLog;
		let executor;

		switch (change) {
			case "nickname":
				if (newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
					audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" });

					auditLog = audit.entries.first();
					if(auditLog && auditLog.changes[0].key === "nick") executor = auditLog.executor;
				}
				if(executor && newMember.user.id !== executor.id)
				{
					if(this.client.user.id === executor.id) return; // Assume already mod logged (if configued)
					const guild = newMember.guild;
					const target = auditLog.target || newMember.user;
					const reason = auditLog.reason || await this.client.bulbutils.translate("global_no_reason", guild.id);
					const infId = await createInfraction(guild.id, "Manual nickname", "false", reason, target.tag, target.id, executor.tag, executor.id);
					return void await SendModActionPreformatted(this.client, guild, await this.client.bulbutils.translate(newMember.nickname ? "change_nick_mod_action_log" : "remove_nick_mod_action_log", guild.id, {
						action: `manually ${await this.client.bulbutils.translate(newMember.nickname ? "action_change_nick" : "action_remove_nick", guild.id)}`,
						target_tag: target.tag,
						user_id: target.id,
						nick_old: oldMember.nickname || target.username,
						nick_new: newMember.nickname || target.username,
						moderator_tag: executor.tag,
						moderator_id: executor.id,
						reason,
						infractionId: infId,
					}));
				}

				if (oldMember.nickname === null) oldMember.nickname = oldMember.user.username;
				if (newMember.nickname === null) newMember.nickname = newMember.user.username;

				message = await this.client.bulbutils.translate("event_member_update_nickname", newMember.guild.id, {
					user_tag: newMember.user.tag,
					user_id: newMember.user.id,
					nick_old: oldMember.nickname,
					nick_new: newMember.nickname,
				});
				break;
			case "newrole":
				role = newMember.guild.roles.cache.get(newMember._roles.diff(oldMember._roles)[0]);
				if (newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
					audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" });

					auditLog = audit.entries.first();
					executor = auditLog.executor;
				}

				if (auditLog) {
					message = await this.client.bulbutils.translate("event_member_update_role_add_audit", newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
						moderator_tag: executor.tag,
						moderator_id: executor.id,
					});
				} else {
					message = await this.client.bulbutils.translate("event_member_update_role_add", newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
					});
				}

				break;
			case "removedrole":
				role = newMember.guild.roles.cache.get(oldMember._roles.diff(newMember._roles)[0]);
				if (newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
					audit = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" });

					auditLog = audit.entries.first();
					executor = auditLog.executor;
				}

				if (auditLog) {
					message = await this.client.bulbutils.translate("event_member_update_role_remove_audit", newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
						moderator_tag: executor.tag,
						moderator_id: executor.id,
					});
				} else {
					message = await this.client.bulbutils.translate("event_member_update_role_remove", newMember.guild.id, {
						user_tag: newMember.user.tag,
						user_id: newMember.user.id,
						role: role.name,
					});
				}

				break;
			default:
				break;
		}

		await SendEventLog(this.client, newMember.guild, "member", Util.removeMentions(message));
	}
};

Array.prototype.diff = function (a) {
	return this.filter(function (i) {
		return a.indexOf(i) < 0;
	});
};

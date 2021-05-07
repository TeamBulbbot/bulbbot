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
					if (auditLog && auditLog.changes[0].key === "nick") executor = auditLog.executor;
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

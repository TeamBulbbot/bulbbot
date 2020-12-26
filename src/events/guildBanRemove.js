const Event = require("../structures/Event");
const { SendModAction } = require("../utils/moderation/log");
const { createInfraction } = require("../utils/InfractionUtils");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild, target) {
		const auditLog = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_REMOVE" });
		const unbanLog = auditLog.entries.first();
		let { executor, reason } = unbanLog;
		if (executor.id === this.client.user.id) return;
		if (reason === null) reason = this.client.bulbutils.translate("global_no_reason");

		const infId = await createInfraction(guild.id, "Manual unban", reason, target.tag, target.id, executor.tag, executor.id);
		await SendModAction(this.client, guild, "manually unbanned", target, executor, reason, infId);
	}
};

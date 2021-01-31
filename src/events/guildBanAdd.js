const Event = require("../structures/Event");
const { SendModAction } = require("../utils/moderation/log");
const { createInfraction } = require("../utils/InfractionUtils");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild, target) {
		const auditLog = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" });

		const banLog = auditLog.entries.first();
		let { executor, reason } = banLog;
		if (executor.id === this.client.user.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason");

		const infId = await createInfraction(guild.id, "Manual ban", "false", reason, target.tag, target.id, executor.tag, executor.id);
		await SendModAction(this.client, guild, "manually banned", target, executor, reason, infId);
	}
};

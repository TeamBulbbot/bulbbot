const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends (
	Event
) {
	constructor(...args) {
		super(...args, {});
	}

	run(member) {
		// TODO
		SendEventLog(this.client, member.guild, "member", `**New member:** **${member.tag}** (${member.id})`);
	}
};

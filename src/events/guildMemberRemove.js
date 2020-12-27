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
		// make a check if the user was kicked or left from the guild
		SendEventLog(this.client, member.guild, "joinleave", `**Member left:** **${member.user.tag}** \`(${member.user.id})\` `);
	}
};

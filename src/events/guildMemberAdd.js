const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(member) {
		SendEventLog(
			this.client,
			member.guild,
			"joinleave",
			await this.client.bulbutils.translate("event_member_joined", {
				user_tag: member.user.tag,
				user_id: member.user.id,
				user_age: member.user.createdAt,
			}),
		);
	}
};

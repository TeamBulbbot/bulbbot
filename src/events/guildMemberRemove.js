const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(member) {
		// TODO
		// make a check if the user was kicked or left from the guild
		await SendEventLog(
			this.client,
			member.guild,
			"joinleave",
			await this.client.bulbutils.translate("event_member_left", {
				user_tag: member.user.tag,
				user_id: member.user.id,
			}),
		);
	}
};

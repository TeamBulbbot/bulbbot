const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");
const { Util } = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(member) {
		await SendEventLog(
			this.client,
			member.guild,
			"joinleave",
			Util.removeMentions(
				await this.client.bulbutils.translate("event_member_joined", {
					user_tag: member.user.tag,
					user_id: member.user.id,
					user_age: member.user.createdAt,
				}),
			),
		);
	}
};

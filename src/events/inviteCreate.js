const Event = require("../structures/Event");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	run(invite) {
		// TODO
		// log somewhere
		console.log(
			`Invite created: \`${invite.code}\`, temporary: ${invite.temporary}, expires: ${invite.maxAge}, max uses: ${invite.maxUses}, created by: **${invite.inviter.tag}** \`(${invite.inviter.id})\``,
		);
	}
};

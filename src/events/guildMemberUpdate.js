const Event = require("../structures/Event");
const { SendEventLog } = require("../utils/moderation/log");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(oldMember, newMember) {
		let change = "";

		if (oldMember._roles.length !== newMember._roles.length)
			oldMember._roles.length < newMember._roles.length ? (change = "newrole") : (change = "removedrole");
		else if (oldMember.nickname !== newMember.nickname) change = "nickname";
		else return;

		console.log(oldMember);

		let message = "";
		let role = "";

		await SendEventLog(this.client, newMember.guild, "member", change);
	}
};

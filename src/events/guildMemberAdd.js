const Event = require("../structures/Event");
const DatabaseManager = new (require("../utils/database/DatabaseManager"));
const { SendEventLog, SendMuteRestore } = require("../utils/moderation/log");
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
				await this.client.bulbutils.translate("event_member_joined", member.guild.id, {
					user_tag: member.user.tag,
					user_id: member.user.id,
					user_age: member.user.createdAt,
				}),
			),
		);

		if (await DatabaseManager.isUserMuted(member.user.id)) {
			member.roles.add(await DatabaseManager.getMuteRole(member.guild));
			await SendMuteRestore(this.client, member.guild, member.user)
		}

		if (!member.pending && (await DatabaseManager.getAutoRole(member.guild)) !== null)
			member.roles.add(member.guild.roles.cache.get(await DatabaseManager.getAutoRole(member.guild)));
	}
};

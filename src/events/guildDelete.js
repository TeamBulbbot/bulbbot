const Event = require("../structures/Event");
const DeleteGuild = require("../utils/guilds/DeleteGuild");
const Emote = require("../emotes.json");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild) {
		await DeleteGuild(guild.id);

		this.client.channels.cache
			.get(global.config.invite)
			.send(
				`${Emote.other.LEAVE} Left guild: **${guild.name}** \`(${guild.id})\` owned by <@${guild.ownerID}> \`(${guild.ownerID})\`\nMembers: **${guild.memberCount}**`,
			);
	}
};

const Event = require("../structures/Event");
const CreateGuild = require("../utils/guilds/CreateGuild");
const Emote = require("../emotes.json");

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {});
	}

	async run(guild) {
		await CreateGuild(guild);

		this.client.channels.cache
			.get(global.config.invite)
			.send(
				`${Emote.other.JOIN} Joined new guild: **${guild.name}** \`(${guild.id})\` owned by <@${guild.ownerID}> \`(${guild.ownerID})\`\nMembers: **${guild.memberCount}**`,
			);
	}
};

const sequelize = require("../database/connection");
const Emotes = require("../../emotes.json");
const moment = require("moment");

module.exports = {
	SendModAction: async (client, guild, action, target, moderator, log, infId) => {
		const dbGuild = await GetDBGuild(guild.id);
		const betterAction = BetterActions(action);

		if (dbGuild.GuildLogging.ModAction === null) return;

		client.channels.cache
			.get(dbGuild.GuildLogging.ModAction)
			.send(
				`\`[${moment().format("hh:mm:ss a")}]\` ${betterAction} **${target.tag}** \`(${target.id})\` by **${moderator.tag}** \`(${
					moderator.id
				})\` because \`${log}\` \`[#${infId}]\``,
			);
	},
};

function BetterActions(action) {
	switch (action.toLowerCase()) {
		case "ban":
			action = `${Emotes.actions.ban} Banned`;
			break;
		case "unban":
			action = `${Emotes.actions.unban} Unbanned`;
			break;
		case "forceban":
			action = `${Emotes.actions.ban} Forcebanned`;
			break;
		case "kick":
			action = `${Emotes.actions.kick} Kicked`;
			break;
		default:
			break;
	}

	return action;
}

function GetDBGuild(guildId) {
	return sequelize.models.Guild.findOne({
		where: { GuildId: guildId },
		include: [{ model: sequelize.models.GuildLogging }],
	});
}

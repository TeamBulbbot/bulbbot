const Event = require("../structures/Event");
const { GetGuild, CheckIfMessageAlreadyInDB } = require("../utils/miscellaneous/starboard");
const sequelize = require("../utils/database/connection");
const emojiUnicode = require("emoji-unicode");
const Discord = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(reaction) {
		if (reaction.message.channel.nsfw) return;
		return;

		const dbGuild = await GetGuild(reaction.message.guild.id);
		const config = dbGuild.starboard;
		const reactionEmote = emojiUnicode(reaction._emoji.name);

		if (!config.enabled) return;
		if (config.Emoji !== reactionEmote) return;
		if (config.channelId === null) return;
		if (config.miniumCount < reaction.count) return;
		if (await CheckIfMessageAlreadyInDB(dbGuild.starboard.id, reaction.message.id)) return;

		const attach = reaction.message.attachments.first();

		const embed = new Discord.MessageEmbed()
			.setColor(pglobal.config.embedColor)
			.setAuthor(reaction.message.author.tag, reaction.message.author.avatarURL())
			.setDescription(
				reaction.message.content +
					"\n\n" +
					`[**Jump to message**](https://bulbbot.discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id})`,
			)
			.setImage(
				attach !== undefined
					? attach.url
					: reaction.message.content.endsWith(".png") | reaction.message.content.endsWith(".jpg") | reaction.message.content.endsWith(".gif")
					? reaction.message.content
					: "",
			)
			.setFooter(`#${reaction.message.channel.name}`)
			.setTimestamp();

		this.client.channels.cache.get(config.channelId).send(embed);

		await sequelize.models.starboardPost.create({
			ogMessageId: reaction.message.id,
			starboardId: dbGuild.id,
		});
	}
};

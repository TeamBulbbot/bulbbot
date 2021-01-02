const Event = require("../structures/Event");
const { GetGuild, CheckIfMessageAlreadyInDB } = require("../utils/miscellaneous/starboard");
const sequelize = require("../utils/database/connection");
const emojiUnicode = require("emoji-unicode");
const Discord = require("discord.js");

module.exports = class extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(reaction, user) {
		if (reaction.message.channel.nsfw) return;

		const dbGuild = await GetGuild(reaction.message.guild.id);
		const config = dbGuild.Starboard;
		const reactionEmote = emojiUnicode(reaction._emoji.name);

		if (!config.Enabled) return;
		if (config.Emoji !== reactionEmote) return;
		if (config.ChannelId === null) return;
		if (config.MiniumCount < reaction.count) return;
		if (await CheckIfMessageAlreadyInDB(dbGuild.Starboard.id, reaction.message.id)) return;

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

		this.client.channels.cache.get(config.ChannelId).send(embed);

		await sequelize.models.starboardPost.create({
			ogMessageId: reaction.message.id,
			starboardId: dbGuild.id,
		});
	}
};

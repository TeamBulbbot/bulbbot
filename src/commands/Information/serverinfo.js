const Discord = require("discord.js");
const Command = require("./../../structures/Command");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Returns some useful information about the current Guild",
			category: "Information",
			aliases: ["server"],
			usage: "!serverinfo",
			userPerms: ["MANAGE_GUILD"],
			clearance: 50,
		});
	}

	async run(message) {
		const guild = message.guild;

		let description = "";
		description += this.client.bulbutils.translate("serverinfo_embed_owner", { guild });
		description += this.client.bulbutils.translate("serverinfo_embed_features", { guild });
		description += this.client.bulbutils.translate("serverinfo_embed_region", { guild });
		description += this.client.bulbutils.translate("serverinfo_embed_verification", { guild });
		description += this.client.bulbutils.translate("serverinfo_embed_created", { guild });

		let serverStats = "";
		serverStats += this.client.bulbutils.translate("serverinfo_server_stats_total", { guild });
		serverStats += this.client.bulbutils.translate("serverinfo_server_stats_online", { guild });
		serverStats += this.client.bulbutils.translate("serverinfo_server_stats_idle", { guild });
		serverStats += this.client.bulbutils.translate("serverinfo_server_stats_dnd", { guild });
		serverStats += this.client.bulbutils.translate("serverinfo_server_stats_offline", { guild });

		let channelStats = "";
		channelStats += this.client.bulbutils.translate("serverinfo_channel_stats_voice", { guild });
		channelStats += this.client.bulbutils.translate("serverinfo_channel_stats_text", { guild });
		channelStats += this.client.bulbutils.translate("serverinfo_channel_stats_category", { guild });

		let boosterStats = "";
		boosterStats += this.client.bulbutils.translate("serverinfo_booster_tier", { guild });
		boosterStats += this.client.bulbutils.translate("serverinfo_booster_boosters", { guild });
		if (guild.premiumTier === 1) boosterStats += this.client.bulbutils.translate("serverinfo_booster_tier_1", { guild });
		else if (guild.premiumTier === 2) boosterStats += this.client.bulbutils.translate("serverinfo_booster_tier_2", { guild });
		else if (guild.premiumTier === 3) boosterStats += this.client.bulbutils.translate("serverinfo_booster_tier_3", { guild });

		let guildRoles = [];
		let guildEmotes = [];
		let rolesLeft = 0;
		let amountOfRoles = 0;
		let emotesLeft = 0;
		let amountOfEmotes = 0;
		guild.roles.cache.forEach(role => {
			amountOfRoles++;
			if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
			else rolesLeft++;
		});
		guild.emojis.cache.forEach(emote => {
			amountOfEmotes++;
			if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
			else emotesLeft++;
		});

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
			.addField(this.client.bulbutils.translate("serverinfo_server_stats"), serverStats, true)
			.addField(this.client.bulbutils.translate("serverinfo_channel_stats"), channelStats, true)
			.addField(this.client.bulbutils.translate("serverinfo_booster_stats"), boosterStats, true)
			.addField(
				this.client.bulbutils.translate("serverinfo_roles", { guild_amount_roles: amountOfRoles }),
				`${guildRoles.join(" ")} ${
					rolesLeft !== 0 ? this.client.bulbutils.translate("serverinfo_roles_too_many", { guild_roles_left: rolesLeft }) : ""
				}`,
				true,
			)
			.addField(
				this.client.bulbutils.translate("serverinfo_emotes", { guild_amount_emotes: amountOfEmotes }),
				amountOfEmotes !== 0
					? `${guildEmotes.join(" ")} ${
							emotesLeft !== 0 ? this.client.bulbutils.translate("serverinfo_emotes_too_many", { guild_emotes_left: emotesLeft }) : ""
					  }`
					: this.client.bulbutils.translate("serverinfo_emotes_none"),
				true,
			)
			.setDescription(description)
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter(
				this.client.bulbutils.translate("global_executed_by", {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

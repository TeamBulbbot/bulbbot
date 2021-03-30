const { getSettings } = require("../../../utils/AutoModUtils");
const Discord = require("discord.js");
const Emotes = require("../../../emotes.json");

module.exports = async (client, message, args) => {
	const settings = await getSettings(message.guild.id);

	const setting = `
		Enabled: ${settings.enabled !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}

        Websites: ${settings.punishmentWebsite !== null ? `\`${settings.punishmentWebsite}\`` : Emotes.other.SWITCHOFF}
        ${settings.websiteWhitelist.length !== 0 ? `Whitelisted websites: ${settings.websiteWhitelist.join(" ")}` : "Whitelisted websites: None"}

        Invites: ${settings.punishmentInvites !== null ? `\`${settings.punishmentInvites}\`` : Emotes.other.SWITCHOFF}
        ${settings.inviteWhitelist.length !== 0 ? `Whitelisted invites: ${settings.inviteWhitelist.join(" ")}` : "Whitelisted invites: None"}

        Words: ${settings.punishmentWords !== null ? `\`${settings.punishmentWords}\`` : Emotes.other.SWITCHOFF}
        ${settings.wordBlacklist.length !== 0 ? `Blacklisted wordes: ${settings.wordBlacklist.join(" ")}` : "Blacklisted wordes: None"}

        Mentions: ${settings.punishmentMentions !== null ? `\`${settings.punishmentMentions}\`` : Emotes.other.SWITCHOFF}
        Limit mentions: ${settings.limitMentions}

        Messages: ${settings.punishmentMessages !== null ? `\`${settings.punishmentMessages}\`` : Emotes.other.SWITCHOFF}
        Limit messages: ${settings.limitMessages}
	`;

	const embed = new Discord.MessageEmbed()
		.setColor(global.config.embedColor)
		.setAuthor(`Automod settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
		.setDescription(setting)
		.setFooter(
			await client.bulbutils.translate("global_executed_by", message.guild.id, {
				user_name: await client.bulbutils.userObject(true, message.member).username,
				user_discriminator: await client.bulbutils.userObject(true, message.member).discriminator,
			}),
			await client.bulbutils.userObject(true, message.member).avatarUrl,
		)
		.setTimestamp();

	return message.channel.send(embed);
};

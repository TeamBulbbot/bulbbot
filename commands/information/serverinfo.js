const Discord = require("discord.js");
const Emotes = require("../../emotes.json");
const Helper = require("../../handlers/Helper");

module.exports = {
	name: "serverinfo",
	aliases: ["server"],
	category: "information",
	description: "Gets some useful information about the server",
	run: async (client, message, args) => {
		let guild = message.guild;

		const countOnline = guild.members.cache.filter((m) => m.presence.status === "online").size;
		const countIdle = guild.members.cache.filter((m) => m.presence.status === "idle").size;
		const countDnd = guild.members.cache.filter((m) => m.presence.status === "dnd").size;

		const countVC = guild.channels.cache.filter((m) => m.type === "voice").size;
		const countCategory = guild.channels.cache.filter((m) => m.type === "category").size;
		const countText = guild.channels.cache.filter((m) => m.type === "text").size;

		let embed = new Discord.MessageEmbed();
		embed.addField(
			"Sever stats",
			`Total: **${guild.memberCount}**/${guild.maximumMembers}\n${Emotes.status.online}: **${countOnline}** \n${Emotes.status.idle}: **${countIdle}** \n${Emotes.status.dnd}: **${countDnd}** \n${Emotes.status.offline}: **${guild.memberCount - countOnline - countIdle - countDnd}**`,
			true
		);
		embed.addField("Channel stats", `Total ${countVC + countText + countCategory}\nCategory: ${countCategory}\nText channels: ${countText}\nVoice Channels: ${countVC}`, true);

		let boosting = `Booster Tier: ${guild.premiumTier}\nAmount of boosters: ${guild.premiumSubscriptionCount}`;
		if (guild.premiumTier === 1) boosting += `\nEmote slots: 100\nAudio quality: 128 kbps`;
		else if (guild.premiumTier === 2) boosting += `\nEmote slots: 150\nAudio quality: 256 kbps\nUpload limit: 50 MB`;
		else if (guild.premiumTier === 3) boosting += `\nEmote slots: 250\nAudio quality: 384 kbps\nUpload limit: 100 MB`;

		embed.addField("Booster", boosting, true);

		embed.setColor(process.env.COLOR);
		if (guild.splash !== null || guild.splash !== undefined) embed.setImage(`https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096`);
		embed.setAuthor(`${guild.name} (${guild.id})`, guild.iconURL());
		embed.setThumbnail(guild.iconURL());
		embed.setDescription(
			`${Emotes.badges.guildOwner} **Owner:** <@${guild.ownerID}> \`\`(${guild.ownerID})\`\`
                **Features:** ${await Helper.Features(guild.features)}
                **Server region:** ${await Helper.Regions(guild.region)}
                **Verfication level:** ${guild.verificationLevel}
				
                `
		);

		embed.setTimestamp();
		embed.setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL());

		return message.channel.send(embed);
	},
};

const Discord = require("discord.js");
const fetch = require("node-fetch");

const Beautify = require("../../utils/helper/beautify");

module.exports = {
	name: "inviteinfo",
	category: "developer",
	description: "Currently in development",
	usage: "inviteinfo <invite code>",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (_client, message, args) => {
		let developers = process.env.DEVELOPERS.split(",");
		if (args[0] === undefined)
			return message.channel.send("Missing required argument");

		if (developers.includes(message.author.id)) {
			let url = `https://discordapp.com/api/v8/invites/${args[0]}?with_counts=true`;
			let settings = { method: "Get" };

			fetch(url, settings)
				.then((res) => res.json())
				.then(async (res) => {
					let desc = "";

					if (res.channel !== undefined) {
						desc += `
					**Channel ID:** ${res.channel.id}
					**Channel Name:** ${res.channel.name}
					**Channel Type:** ${res.channel.type}`;
					}
					if (res.inviter !== undefined) {
						desc += `
\n**Inviter Info**
${Beautify.Badges(res.inviter.public_flags)}
**Inviter ID:** ${res.inviter.id}
**Inviter Username:** ${res.inviter.username}
**Inviter Discriminator:** ${res.inviter.discriminator}
**Inviter Avatar:** https://cdn.discordapp.com/avatars/${res.inviter.id}/${
							res.inviter.avatar
						}.png`;
					}
					if (res.guild.welcome_screen !== undefined)
						desc += `\n**Welcome screen description:** ${res.guild.welcome_screen.description}`;

					const embed = new Discord.MessageEmbed()
						.setColor(process.env.COLOR)
						.setTimestamp()
						.setFooter(
							`Executed by ${message.author.username}#${message.author.discriminator}`,
							message.author.avatarURL()
						)
						.setDescription(
							`
                
**Invite code: ** ${res.code}
**Guild ID: ** ${res.guild.id}
**Guild Name: ** ${res.guild.name}
**Guild Description:** ${res.guild.description}
**Features:** ${Beautify.Features(res.guild.features)}
**Verification Level:** ${res.guild.verification_level}
**Vanity URL Code:** ${res.guild.vanity_url_code}
**Member Count:** ${res.approximate_member_count}
**Presence Count:** ${res.approximate_presence_count}
${desc}


                `
						)
						.setThumbnail(
							`https://cdn.discordapp.com/icons/${res.guild.id}/${res.guild.icon}.png`
						);

					return message.channel.send(embed);
				});
		}
	},
};

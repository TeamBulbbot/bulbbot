const Discord = require("discord.js");

const Guild = require("../../models/guild");
const Emotes = require("../../emotes.json");
const Logger = require("../../utils/other/winston");

module.exports = {
	name: "guild",
	aliases: ["guildconfig", "guilddata"],
	category: "configuration",
	description: "Get the configuration list of the guild",
	usage: "guild",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, _args) => {
		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			(err, guild) => {
				if (err) Logger.error(err);
				let embed = new Discord.MessageEmbed()
					.setColor(process.env.COLOR)
					.setTimestamp()
					.setFooter(
						`Executed by ${message.author.username}#${message.author.discriminator}`,
						message.author.avatarURL()
					)
					.setTitle(`Configuration on ${message.guild.name}`)
					.setDescription(
						`
**Guild Prefix:** \`\`${guild.guildPrefix}\`\`
**Track Analytics:** ${emotify(guild.trackAnalytics)}
					`
					)
					.addField(
						`Settings`,
						`**Bot language:** ${
							guild.settings.language
						}\n**Dm on action:** ${emotify(
							guild.settings.dm_on_action
						)}\n**Allow non latin usernames:** ${emotify(
							guild.settings.allow_non_latin_usernames
						)}`
					)
					.addField(
						`Logging Channels`,
						`**Mod Actions:** ${handleChannels(
							guild.logChannels.modAction
						)}\n**Message Logs:** ${handleChannels(
							guild.logChannels.message
						)}\n**Role Logs:** ${handleChannels(
							guild.logChannels.role
						)}\n**Member Logs:** ${handleChannels(
							guild.logChannels.member
						)}\n**Channel Logs:** ${handleChannels(
							guild.logChannels.channel
						)}\n**Join Leave Logs:** ${handleChannels(
							guild.logChannels.join_leave
						)}`
					)
					.addField(`Roles`, `**Mute:** ${handleRoles(guild.roles.mute)}`);

				return message.channel.send(embed);
			}
		);
	},
};

function emotify(text) {
	if (text) return `${Emotes.other.switchOn} Enabled`;
	else return `${Emotes.other.switchOff} Disabled`;
}
function handleChannels(text) {
	if (text === "" || text === undefined)
		return `${Emotes.other.switchOff} Disabled`;
	else return `${Emotes.other.switchOn} <#${text}>`;
}
function handleRoles(text) {
	if (text === "" || text === undefined)
		return `${Emotes.other.switchOff} None`;
	else return `${Emotes.other.switchOn} <@&${text}>`;
}

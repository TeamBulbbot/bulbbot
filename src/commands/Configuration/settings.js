const Command = require("../../structures/Command");
const DatabaseManager = new (require("../../utils/database/DatabaseManager"))();
const Discord = require("discord.js");
const Emotes = require("../../emotes.json");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Get the settings for the guild",
			category: "Configuration",
			aliases: ["overrides"],
			usage: "!settings",
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message) {
		const data = await DatabaseManager.getFullGuildConfig(message.guild.id);

		const configs = `
		**Configuration **
		Prefix: \`${data.guildConfiguration.prefix}\`
		Bot language: \`${data.guildConfiguration.language}\`
		Premium server: ${data.guildConfiguration.premiumGuild !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}
		Mute role: ${data.guildConfiguration.muteRole !== null ? `<@&${data.guildConfiguration.muteRole}>` : Emotes.other.SWITCHOFF}
		Auto role:  ${data.guildConfiguration.autorole !== null ? `<@&${data.guildConfiguration.autorole}>` : Emotes.other.SWITCHOFF}
		`;

		const loggingModule = `
		**Logging**
		Logging timezone: \`${data.guildConfiguration.timezone}\`
		Mod actions: ${data.guildLogging.modAction !== null ? `<#${data.guildLogging.modAction}>` : Emotes.other.SWITCHOFF}
		Automod: ${data.guildLogging.automod !== null ? `<#${data.guildLogging.automod}>` : Emotes.other.SWITCHOFF}
		Message logs: ${data.guildLogging.message !== null ? `<#${data.guildLogging.message}>` : Emotes.other.SWITCHOFF}
		Role logs: ${data.guildLogging.role !== null ? `<#${data.guildLogging.role}>` : Emotes.other.SWITCHOFF}
		Member logs: ${data.guildLogging.member !== null ? `<#${data.guildLogging.member}>` : Emotes.other.SWITCHOFF}
		Channel logs: ${data.guildLogging.channel !== null ? `<#${data.guildLogging.channel}>` : Emotes.other.SWITCHOFF}
		Join leave logs: ${data.guildLogging.joinLeave !== null ? `<#${data.guildLogging.joinLeave}>` : Emotes.other.SWITCHOFF} `;

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setAuthor(`Settings for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
			.setDescription(configs + loggingModule)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

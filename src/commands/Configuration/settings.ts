import Command from "../../structures/Command";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { Message, MessageEmbed } from "discord.js";
import Emotes from "../../emotes.json";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

const databaseManager = new DatabaseManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Get the settings for the guild",
			category: "Configuration",
			aliases: ["overrides"],
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message) {
		const guildConfig = await databaseManager.getConfig(message.guild!.id);
		const loggingConfig = await databaseManager.getLoggingConfig(message.guild!.id);

		const configs = `
		**Configuration **
		Prefix: \`${guildConfig.prefix}\`
		Bot language: \`${guildConfig.language}\`
		Premium server: ${guildConfig.premiumGuild !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}
		Mute role: ${guildConfig.muteRole !== null ? `<@&${guildConfig.muteRole}>` : Emotes.other.SWITCHOFF}
		Auto role:  ${guildConfig.autorole !== null ? `<@&${guildConfig.autorole}>` : Emotes.other.SWITCHOFF}
		`;

		const loggingModule = `
		**Logging**
		Logging timezone: \`${guildConfig.timezone}\`
		Mod actions: ${loggingConfig.modAction !== null ? `<#${loggingConfig.modAction}>` : Emotes.other.SWITCHOFF}
		Automod: ${loggingConfig.automod !== null ? `<#${loggingConfig.automod}>` : Emotes.other.SWITCHOFF}
		Message logs: ${loggingConfig.message !== null ? `<#${loggingConfig.message}>` : Emotes.other.SWITCHOFF}
		Role logs: ${loggingConfig.role !== null ? `<#${loggingConfig.role}>` : Emotes.other.SWITCHOFF}
		Member logs: ${loggingConfig.member !== null ? `<#${loggingConfig.member}>` : Emotes.other.SWITCHOFF}
		Channel logs: ${loggingConfig.channel !== null ? `<#${loggingConfig.channel}>` : Emotes.other.SWITCHOFF}
		Join leave logs: ${loggingConfig.joinLeave !== null ? `<#${loggingConfig.joinLeave}>` : Emotes.other.SWITCHOFF} `;

		const memberObj = await this.client.bulbutils.userObject(true, message.member!);

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setAuthor(`Settings for ${message.guild!.name}`, message.guild?.iconURL({ dynamic: true }) ?? undefined)
			.setDescription(configs + loggingModule)
			.setFooter(await this.client.bulbutils.translate("global_executed_by", message.guild!.id, { user: message.author }), memberObj.avatarUrl)
			.setTimestamp();

		return message.channel.send(embed);
	}
}

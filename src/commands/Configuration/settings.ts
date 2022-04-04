import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { MessageEmbed } from "discord.js";
import Emotes from "../../emotes.json";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import { GuildConfiguration, LoggingConfiguration } from "../../utils/types/DatabaseStructures";

const databaseManager = new DatabaseManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Get the settings for the server",
			category: "Configuration",
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext) {
		const guildConfig: GuildConfiguration = await databaseManager.getConfig(context.guild!.id);
		const loggingConfig: LoggingConfiguration = await databaseManager.getLoggingConfig(context.guild!.id);

		const configs: string[] = [
			`**Configuration**`,
			`Prefix: \`${guildConfig.prefix}\` or [slash commands](https://docs.bulbbot.rocks/slash-commands/)`,
			`Bot Language: \`${guildConfig.language}\``,
			`Premium Server: ${guildConfig.premiumGuild ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Auto Role:  ${guildConfig.autorole !== null ? `<@&${guildConfig.autorole}>` : Emotes.other.SWITCHOFF}`,
			`Actions on Info:  ${guildConfig.actionsOnInfo ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Roles on Leave:  ${guildConfig.rolesOnLeave ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Quick reasons: ${guildConfig.quickReasons.length ? guildConfig.quickReasons.map((r) => `\`${r}\``).join(" ") : Emotes.other.SWITCHOFF}`,
		];

		const loggingModule: string[] = [
			`**Logging**`,
			`Logging Timezone: \`${guildConfig.timezone}\``,
			`Mod Logs: ${loggingConfig.modAction !== null ? `<#${loggingConfig.modAction}>` : Emotes.other.SWITCHOFF}`,
			`Banpool Logs: ${loggingConfig.banpool !== null ? `<#${loggingConfig.banpool}>` : Emotes.other.SWITCHOFF}`,
			`Automod: ${loggingConfig.automod !== null ? `<#${loggingConfig.automod}>` : Emotes.other.SWITCHOFF}`,
			`Message Logs: ${loggingConfig.message !== null ? `<#${loggingConfig.message}>` : Emotes.other.SWITCHOFF}`,
			`Role Logs: ${loggingConfig.role !== null ? `<#${loggingConfig.role}>` : Emotes.other.SWITCHOFF}`,
			`Member Logs: ${loggingConfig.member !== null ? `<#${loggingConfig.member}>` : Emotes.other.SWITCHOFF}`,
			`Channel Logs: ${loggingConfig.channel !== null ? `<#${loggingConfig.channel}>` : Emotes.other.SWITCHOFF}`,
			`Thread Logs: ${loggingConfig.thread !== null ? `<#${loggingConfig.thread}>` : Emotes.other.SWITCHOFF}`,
			`Invite Logs: ${loggingConfig.invite !== null ? `<#${loggingConfig.invite}>` : Emotes.other.SWITCHOFF}`,
			`Join Leave Logs: ${loggingConfig.joinLeave !== null ? `<#${loggingConfig.joinLeave}>` : Emotes.other.SWITCHOFF}`,
			`Other: ${loggingConfig.other !== null ? `<#${loggingConfig.other}>` : Emotes.other.SWITCHOFF}`,
		];

		const memberObj = await this.client.bulbutils.userObject(true, context.member!);

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setAuthor({
				name: `Settings for ${context.guild!.name}`,
				iconURL: context.guild?.iconURL({ dynamic: true }) ?? undefined,
			})
			.setDescription(`${configs.join("\n")}\n\n${loggingModule.join("\n")}`)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild!.id, { user: context.author }),
				iconURL: memberObj.avatarUrl,
			})
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}

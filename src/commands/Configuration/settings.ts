import DatabaseManager from "../../utils/managers/DatabaseManager";
import { CommandInteraction, Guild, MessageEmbed } from "discord.js";
import Emotes from "../../emotes.json";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";

const databaseManager = new DatabaseManager();

export default class Settings extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Get the current settings for the server",
			type: ApplicationCommandType.ChatInput,
			options: [],
			command_permissions: ["MANAGE_GUILD"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const { guildConfiguration, guildLogging } = (await databaseManager.getFullGuildConfig(interaction.guild as Guild)) || {};

		if (!guildConfiguration || !guildLogging)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.settings_db_null", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const configs: string[] = [
			`**Configuration**`,
			`Bot Language: \`${guildConfiguration.language}\``,
			`Premium Server: ${guildConfiguration.premiumGuild ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Auto Role:  ${guildConfiguration.autorole !== null ? `<@&${guildConfiguration.autorole}>` : Emotes.other.SWITCHOFF}`,
			`Actions on Info:  ${guildConfiguration.actionsOnInfo ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Roles on Leave:  ${guildConfiguration.rolesOnLeave ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Nickname change infraction:  ${guildConfiguration.manualNicknameInf ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`,
			`Quick reasons: ${guildConfiguration.quickReasons.length ? guildConfiguration.quickReasons.map((r) => `\`${r}\``).join(" ") : Emotes.other.SWITCHOFF}`,
		];

		const loggingModule: string[] = [
			`**Logging**`,
			`Logging Timezone: \`${guildConfiguration.timezone}\``,
			`Mod Logs: ${guildLogging.modAction !== null ? `<#${guildLogging.modAction}>` : Emotes.other.SWITCHOFF}`,
			`Banpool Logs: ${guildLogging.banpool !== null ? `<#${guildLogging.banpool}>` : Emotes.other.SWITCHOFF}`,
			`Automod: ${guildLogging.automod !== null ? `<#${guildLogging.automod}>` : Emotes.other.SWITCHOFF}`,
			`Message Logs: ${guildLogging.message !== null ? `<#${guildLogging.message}>` : Emotes.other.SWITCHOFF}`,
			`Role Logs: ${guildLogging.role !== null ? `<#${guildLogging.role}>` : Emotes.other.SWITCHOFF}`,
			`Member Logs: ${guildLogging.member !== null ? `<#${guildLogging.member}>` : Emotes.other.SWITCHOFF}`,
			`Channel Logs: ${guildLogging.channel !== null ? `<#${guildLogging.channel}>` : Emotes.other.SWITCHOFF}`,
			`Thread Logs: ${guildLogging.thread !== null ? `<#${guildLogging.thread}>` : Emotes.other.SWITCHOFF}`,
			`Invite Logs: ${guildLogging.invite !== null ? `<#${guildLogging.invite}>` : Emotes.other.SWITCHOFF}`,
			`Join Leave Logs: ${guildLogging.joinLeave !== null ? `<#${guildLogging.joinLeave}>` : Emotes.other.SWITCHOFF}`,
			`Other: ${guildLogging.other !== null ? `<#${guildLogging.other}>` : Emotes.other.SWITCHOFF}`,
		];

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setAuthor({
				name: `Settings for ${interaction.guild?.name}`,
				iconURL: interaction.guild?.iconURL({ dynamic: true }) ?? undefined,
			})
			.setDescription(`${configs.join("\n")}\n\n${loggingModule.join("\n")}`)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, { user: interaction.user }),
				iconURL: interaction.user.avatarURL({ dynamic: true }) ?? undefined,
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	}
}

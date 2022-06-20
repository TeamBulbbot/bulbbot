import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { MessageEmbed } from "discord.js";
import Emotes from "../../emotes.json";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import { isNullish } from "../../utils/helpers";

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
		if (!context.guild?.id) {
			console.error("Guild/GuildID is not defined (in commands/Configuration/settings)");
			return;
		}
		if (isNullish(context.guild)) {
			return;
		}
		const { guildConfiguration, guildLogging } = (await databaseManager.getFullGuildConfig(context.guild)) || {};

		if (!guildConfiguration || !guildLogging) {
			return;
		}

		const configs: string[] = [
			`**Configuration**`,
			`Prefix: \`${guildConfiguration.prefix}\` or [slash commands](https://docs.bulbbot.rocks/slash-commands/)`,
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

		const memberObj = this.client.bulbutils.userObject(true, context.member);

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setAuthor({
				name: `Settings for ${context.guild.name}`,
				iconURL: context.guild.iconURL({ dynamic: true }) ?? undefined,
			})
			.setDescription(`${configs.join("\n")}\n\n${loggingModule.join("\n")}`)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, { user: context.author }),
				iconURL: memberObj?.avatarUrl ?? "",
			})
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}

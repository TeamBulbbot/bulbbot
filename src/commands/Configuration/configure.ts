import { CommandInteraction, Guild, GuildTextBasedChannel, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import * as Emotes from "../../emotes.json";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v10";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configure the bot.",
			type: ApplicationCommandType.ChatInput,
			options: [],
			command_permissions: ["ADMINISTRATOR"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("configure-main")
				.setPlaceholder(await this.client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
				.addOptions([
					{
						label: await this.client.bulbutils.translate("config_main_options.actions_on_info", interaction.guild?.id, {}),
						value: "actionsOnInfo",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.actions_on_info", interaction.guild?.id, {}),
						emoji: Emotes.configure.ACTIONS_ON_INFO,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.automod", interaction.guild?.id, {}),
						value: "automod",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.automod", interaction.guild?.id, {}),
						emoji: Emotes.configure.AUTOMOD,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.autorole", interaction.guild?.id, {}),
						value: "autorole",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.autorole", interaction.guild?.id, {}),
						emoji: Emotes.configure.AUTOROLE,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.language", interaction.guild?.id, {}),
						value: "language",
						emoji: Emotes.configure.LANGUAGE,
						description: await this.client.bulbutils.translate("config_main_options_descriptions.language", interaction.guild?.id, {}),
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.logging", interaction.guild?.id, {}),
						value: "logging",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.logging", interaction.guild?.id, {}),
						emoji: Emotes.configure.LOGGING,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.prefix", interaction.guild?.id, {}),
						value: "prefix",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.prefix", interaction.guild?.id, {}),
						emoji: Emotes.features.MEMBER_LIST_DISABLED,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.quick_reasons", interaction.guild?.id, {}),
						value: "quickReasons",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.quick_reasons", interaction.guild?.id, {}),
						emoji: Emotes.features.MEMBER_PROFILES,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.roles_on_leave", interaction.guild?.id, {}),
						value: "rolesOnLeave",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.roles_on_leave", interaction.guild?.id, {}),
						emoji: Emotes.features.HUB,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.manual_nickname_inf", interaction.guild?.id, {}),
						value: "manualNicknameInf",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.manual_nickname_inf", interaction.guild?.id, {}),
						emoji: Emotes.features.MEMBER_LIST_DISABLED,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.timezone", interaction.guild?.id, {}),
						value: "timezone",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.timezone", interaction.guild?.id, {}),
						emoji: Emotes.configure.TIMEZONE,
					},
				]),
		);

		await interaction.reply({
			content: await this.client.bulbutils.translate("config_main_header", interaction.guild?.id, {
				guild: interaction.guild as Guild,
			}),
			components: [row],
		});

		const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
		const collector = (interaction.channel as GuildTextBasedChannel).createMessageComponentCollector({ filter, time: 60000, max: 1 });

		collector.on("collect", async (i: MessageComponentInteraction) => {
			if (i.isSelectMenu()) {
				await require(`./configure/${i.values[0]}`).default(i, this.client);
			}
		});
	}
}

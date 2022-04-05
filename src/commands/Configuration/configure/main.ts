import { MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import * as Emotes from "../../../emotes.json";

export default async function (interaction: MessageComponentInteraction, client: BulbBotClient) {
	if (!interaction.guild) return;

	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("configure-main")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.addOptions([
				{
					label: await client.bulbutils.translate("config_main_options.actions_on_info", interaction.guild?.id, {}),
					value: "actionsOnInfo",
					description: await client.bulbutils.translate("config_main_options_descriptions.actions_on_info", interaction.guild?.id, {}),
					emoji: Emotes.configure.ACTIONS_ON_INFO,
				},
				{
					label: await client.bulbutils.translate("config_main_options.automod", interaction.guild?.id, {}),
					value: "automod",
					description: await client.bulbutils.translate("config_main_options_descriptions.automod", interaction.guild?.id, {}),
					emoji: Emotes.configure.AUTOMOD,
				},
				{
					label: await client.bulbutils.translate("config_main_options.autorole", interaction.guild?.id, {}),
					value: "autorole",
					description: await client.bulbutils.translate("config_main_options_descriptions.autorole", interaction.guild?.id, {}),
					emoji: Emotes.configure.AUTOROLE,
				},
				{
					label: await client.bulbutils.translate("config_main_options.language", interaction.guild?.id, {}),
					value: "language",
					emoji: Emotes.configure.LANGUAGE,
					description: await client.bulbutils.translate("config_main_options_descriptions.language", interaction.guild?.id, {}),
				},
				{
					label: await client.bulbutils.translate("config_main_options.logging", interaction.guild?.id, {}),
					value: "logging",
					description: await client.bulbutils.translate("config_main_options_descriptions.logging", interaction.guild?.id, {}),
					emoji: Emotes.configure.LOGGING,
				},
				{
					label: await client.bulbutils.translate("config_main_options.prefix", interaction.guild?.id, {}),
					value: "prefix",
					description: await client.bulbutils.translate("config_main_options_descriptions.prefix", interaction.guild?.id, {}),
					emoji: Emotes.features.MEMBER_LIST_DISABLED,
				},
				{
					label: await client.bulbutils.translate("config_main_options.quick_reasons", interaction.guild?.id, {}),
					value: "quickReasons",
					description: await client.bulbutils.translate("config_main_options_descriptions.quick_reasons", interaction.guild?.id, {}),
					emoji: Emotes.features.MEMBER_PROFILES,
				},
				{
					label: await client.bulbutils.translate("config_main_options.roles_on_leave", interaction.guild?.id, {}),
					value: "rolesOnLeave",
					description: await client.bulbutils.translate("config_main_options_descriptions.roles_on_leave", interaction.guild?.id, {}),
					emoji: Emotes.features.HUB,
				},
				{
					label: await client.bulbutils.translate("config_main_options.timezone", interaction.guild?.id, {}),
					value: "timezone",
					description: await client.bulbutils.translate("config_main_options_descriptions.timezone", interaction.guild?.id, {}),
					emoji: Emotes.configure.TIMEZONE,
				},
			]),
	);

	await interaction.update({
		content: await client.bulbutils.translate("config_main_header", interaction.guild?.id, {
			guild: interaction.guild,
		}),
		components: [row],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isSelectMenu()) {
			await require(`./${i.values[0]}`).default(i, client);
		}
	});
}

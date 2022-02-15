import { MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import * as Emotes from "../../../emotes.json";

export default async function (interaction: MessageComponentInteraction, client: BulbBotClient) {
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("configure-main")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.addOptions([
				{
					label: await client.bulbutils.translate("config_main_option_actions_on_info", interaction.guild?.id, {}),
					value: "actionsOnInfo",
					description: "Configure the actions on info setting",
					emoji: Emotes.configure.ACTIONS_ON_INFO,
				},
				{
					label: "Automod",
					value: "automod",
					description: "Configure the Automod settings",
					emoji: Emotes.configure.AUTOMOD,
				},
				{
					label: "Autorole",
					value: "autorole",
					description: "Configure the autorole setting",
					emoji: Emotes.configure.AUTOROLE,
				},
				{
					label: await client.bulbutils.translate("config_main_option_language", interaction.guild?.id, {}),
					value: "language",
					emoji: Emotes.configure.LANGUAGE,
					description: "Change the language of the bot",
				},
				{
					label: "Logging",
					value: "logging",
					description: "Configure the logging modules",
					emoji: Emotes.configure.LOGGING,
				},
				{
					label: await client.bulbutils.translate("config_main_option_prefix", interaction.guild?.id, {}),
					value: "prefix",
					description: "Configure the prefix of the bot",
					emoji: Emotes.features.MEMBER_LIST_DISABLED,
				},
				{
					label: "Quick Reasons",
					value: "quickReasons",
					description: "Add or remove quick reasons",
					emoji: Emotes.features.MEMBER_PROFILES,
				},
				{
					label: await client.bulbutils.translate("config_main_option_roles_on_leave", interaction.guild?.id, {}),
					value: "rolesOnLeave",
					description: "Configure the roles on leave setting",
					emoji: Emotes.features.HUB,
				},
				{
					label: "Timezone",
					value: "timezone",
					description: "Configure the timezone for logging",
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

	const filter = i => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isSelectMenu()) {
			switch (i.values[0]) {
				case "actionsOnInfo":
					await require("./actionsOnInfo").default(i, client);
					break;
				case "automod":
					await require("./automod").default(i, client);
					break;
				case "autorole":
					await require("./autorole").default(i, client);
					break;
				case "language":
					await require("./language").default(i, client);
					break;
				case "logging":
					await require("./logging").default(i, client);
					break;
				case "prefix":
					await require("./prefix").default(i, client);
					break;
				case "quickReasons":
					await require("./quickReasons").default(i, client);
					break;
				case "rolesOnLeave":
					await require("./rolesOnLeave").default(i, client);
					break;
				case "timezone":
					await require("./timezone").default(i, client);
					break;
			}
		}
	});
}

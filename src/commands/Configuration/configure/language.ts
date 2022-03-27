import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

async function language(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await databaseManager.getConfig(interaction.guild?.id as Snowflake);

	const placeholderRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(`Current language: ${config.language}`)
			.setDisabled(true)
			.addOptions([{ label: "Placeholder", value: "placeholder" }]),
	);

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("language")
			.setPlaceholder(await client.bulbutils.translate("config_language_placeholder", interaction.guild?.id, {}))
			.addOptions([
				{ label: "English, US (English US)", value: "en-us" },
				{ label: "Slovak (Slovenčina)", value: "sk-sk" },
				{ label: "Swedish (Svenska)", value: "sv-se" },
				{ label: "French (Français)", value: "fr-fr" },
				{ label: "Portuguese (Português)", value: "pt-br" },
				{ label: "Czech (Čeština)", value: "cs-cz" },
				{ label: "Italian (Italiano)", value: "it-it" },
				{ label: "Hindi (हिंदी)", value: "hi-in" },
			]),
	);

	const buttonRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("back")
			.setLabel(await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}))
			.setStyle("DANGER"),
	);

	await interaction.update({
		content: await client.bulbutils.translate("config_language_header", interaction.guild?.id, {}),
		components: [placeholderRow, selectRow, buttonRow],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isSelectMenu()) {
			await databaseManager.setLanguage(i.guild?.id as Snowflake, i.values[0]);
			await interaction.followUp({
				content: await client.bulbutils.translate("config_language_success", interaction.guild?.id, {
					language: i.values[0],
				}),
				ephemeral: true,
			});

			await language(i, client);
			return;
		} else {
			if (i.isButton()) {
				if (i.customId === "back") {
					await require("./main").default(i, client);
					return;
				}
			}
		}
	});
}

export default language;

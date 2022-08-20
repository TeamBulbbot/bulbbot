import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import { isNullish } from "../../../utils/helpers";

const databaseManager: DatabaseManager = new DatabaseManager();

async function language(interaction: MessageComponentInteraction, client: BulbBotClient) {
	if (isNullish(interaction.guild)) {
		return;
	}
	const config = await databaseManager.getConfig(interaction.guild);

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
				{ label: "Hungarian (Magyar)", value: "hu-hu" },
				{ label: "Spanish (Español)", value: "es-es" },
			]),
	);

	const buttonRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("back")
			.setLabel(await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}))
			.setStyle("DANGER"),
	);

	interaction.deferred
		? await interaction.editReply({
				content: await client.bulbutils.translate("config_language_header", interaction.guild?.id, {}),
				components: [placeholderRow, selectRow, buttonRow],
		  })
		: await interaction.update({
				content: await client.bulbutils.translate("config_language_header", interaction.guild?.id, {}),
				components: [placeholderRow, selectRow, buttonRow],
		  });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (isNullish(i.guild)) {
			return;
		}
		if (i.isSelectMenu()) {
			await databaseManager.updateConfig({ guild: i.guild, table: "guildConfiguration", field: "language", value: i.values[0] });
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

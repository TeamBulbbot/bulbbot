import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";

const databaseManager: DatabaseManager = new DatabaseManager();

async function prefix(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await databaseManager.getConfig(interaction.guild?.id as Snowflake);

	const placeholderRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(`Current prefix: ${config.prefix}`)
			.setDisabled(true)
			.addOptions([
				{
					label: "Placeholder",
					value: "placeholder",
				},
			]),
	);

	const [back, change, header, reset] = [
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_prefix_button_change", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_prefix_header", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_prefix_button_reset", interaction.guild?.id, {}),
	];

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setLabel(back).setStyle("DANGER"),
		new MessageButton().setCustomId("change").setLabel(change).setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId("reset")
			.setLabel(reset)
			.setStyle("PRIMARY")
			.setDisabled(config.prefix === "!"),
	]);

	interaction.deferred
		? await interaction.editReply({ content: header, components: [placeholderRow, buttonRow] })
		: await interaction.update({ content: header, components: [placeholderRow, buttonRow] });

	const filter = i => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "back":
					await require("./main").default(i, client);
					break;
				case "reset":
					await interaction.followUp({
						content: await client.bulbutils.translate("config_prefix_reset", interaction.guild?.id, {}),
						ephemeral: true,
					});
					await databaseManager.setPrefix(interaction.guild?.id as Snowflake, "!");
					await prefix(i, client);
					break;
				case "change":
					buttonRow.components[0].setDisabled(true);
					buttonRow.components[1].setDisabled(true);
					buttonRow.components[2].setDisabled(true);

					await interaction.editReply({ components: [placeholderRow, buttonRow] });

					const msgFilter = (m: Message) => m.author.id === interaction.user.id;
					const msgCollector = i.channel?.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });
					await interaction.followUp({
						content: await client.bulbutils.translate("config_prefix_prompt", interaction.guild?.id, {}),
						ephemeral: true,
					});
					await i.deferUpdate();

					msgCollector?.on("collect", async (m: Message) => {
						if (m.content.length >= 255) {
							await m.delete();
							await interaction.followUp({
								content: await client.bulbutils.translate("config_prefix_too_long", interaction.guild?.id, {}),
								ephemeral: true,
							});

							await prefix(i, client);
							return;
						}

						await interaction.followUp({
							content: await client.bulbutils.translate("config_prefix_success", interaction.guild?.id, {
								prefix: m.content,
							}),
							ephemeral: true,
						});
						await m.delete();

						await databaseManager.setPrefix(interaction.guild?.id as Snowflake, m.content);

						await prefix(i, client);
					});

					break;
				default:
					await require("./main").default(i, client);
					break;
			}
		}
	});
}

export default prefix;

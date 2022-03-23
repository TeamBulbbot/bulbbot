import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Role, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";
import { NonDigits } from "../../../utils/Regex";

const databaseManager: DatabaseManager = new DatabaseManager();

async function autorole(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await databaseManager.getConfig(interaction.guild?.id as Snowflake);
	const role: Role | null = config.autorole !== null ? ((await client.bulbfetch.getRole(interaction.guild?.roles, config.autorole)) as Role) : null;

	const placeholderRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(
				config.autorole !== null
					? await client.bulbutils.translate("config_autorole_placeholder", interaction.guild?.id, { role })
					: await client.bulbutils.translate("config_autorole_placeholder_disabled", interaction.guild?.id, {}),
			)
			.setDisabled(true)
			.addOptions([
				{
					label: "Placeholder",
					value: "placeholder",
				},
			]),
	);

	const [back, change, disable, header] = [
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_autorole_button_change", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_autorole_button_disable", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_autorole_header", interaction.guild?.id, {}),
	];

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setLabel(back).setStyle("DANGER"),
		new MessageButton().setCustomId("change").setLabel(change).setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId("disable")
			.setLabel(disable)
			.setStyle("PRIMARY")
			.setDisabled(config.autorole === null),
	]);

	interaction.deferred
		? await interaction.editReply({ content: header, components: [placeholderRow, buttonRow] })
		: await interaction.update({ content: header, components: [placeholderRow, buttonRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "back":
					await require("./main").default(i, client);
					break;
				case "disable":
					await databaseManager.setAutoRole(interaction.guild?.id as Snowflake, null);
					await interaction.followUp({
						content: await client.bulbutils.translate("config_autorole_disable", interaction.guild?.id, {}),
						ephemeral: true,
					});

					await autorole(i, client);
					break;
				case "change":
					for (const component of buttonRow.components) {
						component.setDisabled(true);
					}

					await interaction.editReply({ components: [placeholderRow, buttonRow] });

					const msgFilter = (m: Message) => m.author.id === interaction.user.id;
					const msgCollector = interaction.channel?.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });
					await interaction.followUp({
						content: await client.bulbutils.translate("config_autorole_prompt", interaction.guild?.id, {}),
						ephemeral: true,
					});
					await i.deferUpdate();

					msgCollector?.on("collect", async (m: Message) => {
						const roleId = m.content.replace(NonDigits, "");
						const role = await client.bulbfetch.getRole(interaction.guild?.roles, roleId);
						await m.delete();

						if (!role) {
							await interaction.followUp({
								content: await client.bulbutils.translate("global_cannot_convert_special", interaction.guild?.id, {
									arg_provided: m.content,
									arg_expected: "role:Role",
								}),
								ephemeral: true,
							});
							await autorole(i, client);
							return;
						}

						await databaseManager.setAutoRole(interaction.guild?.id as Snowflake, role.id);
						await interaction.followUp({
							content: await client.bulbutils.translate("config_autorole_success", interaction.guild?.id, { role }),
							ephemeral: true,
						});
						await autorole(i, client);
					});
			}
		}
	});
}

export default autorole;

import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

async function actionsOnInfo(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await databaseManager.getConfig(interaction.guild?.id as Snowflake);

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(`Currently ${config.actionsOnInfo ? "enabled" : "disabled"}`)
			.setDisabled(true)
			.addOptions([
				{
					label: "Placeholder",
					value: "placeholder",
				},
			]),
	);

	const [enable, disable, back] = [
		await client.bulbutils.translate("config_button_enable", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_button_disable", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
	];

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setStyle("DANGER").setLabel(back),
		new MessageButton()
			.setCustomId(config.actionsOnInfo ? "disable" : "enable")
			.setStyle(config.actionsOnInfo ? "DANGER" : "SUCCESS")
			.setLabel(config.actionsOnInfo ? disable : enable),
	]);

	await interaction.update({
		content: await client.bulbutils.translate("config_actions_on_info_header", interaction.guild?.id, {}),
		components: [selectRow, buttonRow],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "back":
					await require("./main").default(i, client);
					break;
				case "enable":
					await databaseManager.setActionsOnInfo(i.guild?.id as Snowflake, true);
					await actionsOnInfo(i, client);
					break;
				case "disable":
					await databaseManager.setActionsOnInfo(i.guild?.id as Snowflake, false);
					await actionsOnInfo(i, client);
					break;
				default:
					await require("./main").default(i, client);
					break;
			}
		}
	});
}

export default actionsOnInfo;

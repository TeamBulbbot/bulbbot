import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import { isNullish } from "../../../utils/helpers";

const databaseManager: DatabaseManager = new DatabaseManager();

async function actionsOnInfo(interaction: MessageComponentInteraction, client: BulbBotClient) {
	if (isNullish(interaction.guild)) {
		if (!interaction.replied) {
			interaction.reply({
				data: {
					content: "Error",
				},
				ephemeral: true,
			});
		}
		return;
	}
	const config = await databaseManager.getConfig(interaction.guild);

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

	interaction.deferred
		? await interaction.editReply({
				content: await client.bulbutils.translate("config_actions_on_info_header", interaction.guild?.id, {}),
				components: [selectRow, buttonRow],
		  })
		: await interaction.update({
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
				case "disable":
				case "enable":
					if (isNullish(i.guild)) {
						return;
					}
					await databaseManager.updateConfig({ guild: i.guild, table: "guildConfiguration", field: "actionsOnInfo", value: i.customId === "enable" });
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

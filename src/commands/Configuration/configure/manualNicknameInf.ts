import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";
import BulbBotClient from "../../../structures/BulbBotClient";

const { getConfig, setManualNicknameInf } = new DatabaseManager();

async function manualNicknameInf(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await getConfig(interaction.guild?.id as Snowflake);

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(`Currently ${config.manualNicknameInf ? "enabled" : "disabled"}`)
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
			.setCustomId(config.manualNicknameInf ? "disable" : "enable")
			.setStyle(config.manualNicknameInf ? "DANGER" : "SUCCESS")
			.setLabel(config.manualNicknameInf ? disable : enable),
	]);

	await interaction.update({
		content: await client.bulbutils.translate("config_manual_nickname_infractions", interaction.guild?.id, {}),
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
					await setManualNicknameInf(i.guild?.id as Snowflake, true);
					await manualNicknameInf(i, client);
					break;
				case "disable":
					await setManualNicknameInf(i.guild?.id as Snowflake, false);
					await manualNicknameInf(i, client);
					break;
				default:
					await require("./main").default(i, client);
					break;
			}
		}
	});
}

export default manualNicknameInf;

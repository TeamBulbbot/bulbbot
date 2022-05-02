import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";
import BulbBotClient from "../../../structures/BulbBotClient";

const { getConfig, setManuelNicknameInf } = new DatabaseManager();

async function manuelNicknameInf(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await getConfig(interaction.guild?.id as Snowflake);

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("placeholder")
			.setPlaceholder(`Currently ${config.manuelNicknameInf ? "enabled" : "disabled"}`)
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
			.setCustomId(config.manuelNicknameInf ? "disable" : "enable")
			.setStyle(config.manuelNicknameInf ? "DANGER" : "SUCCESS")
			.setLabel(config.manuelNicknameInf ? disable : enable),
	]);

	await interaction.update({
		content: await client.bulbutils.translate("config_manuel_nickname_infractions", interaction.guild?.id, {}),
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
					await setManuelNicknameInf(i.guild?.id as Snowflake, true);
					await manuelNicknameInf(i, client);
					break;
				case "disable":
					await setManuelNicknameInf(i.guild?.id as Snowflake, false);
					await manuelNicknameInf(i, client);
					break;
				default:
					await require("./main").default(i, client);
					break;
			}
		}
	});
}

export default manuelNicknameInf;

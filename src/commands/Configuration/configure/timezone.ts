import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/DatabaseStructures";

const databaseManager: DatabaseManager = new DatabaseManager();

async function timezone(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const config: GuildConfiguration = await databaseManager.getConfig(interaction.guild?.id as Snowflake);
	const pages: { label: string; value: string }[][] = [];
	let currPage: number = 0;

	for (let i = 0; i < 3; i++) {
		let page: { label: string; value: string }[] = [];
		for (let j = 0; j < 9; j++) {
			const [code, name] = Object.entries(client.bulbutils.timezones)[i * 9 + j];
			page.push({
				label: `${code} (${name})`,
				value: code,
			});
		}

		pages.push(page);
	}

	let selectRow = new MessageActionRow().addComponents([
		new MessageSelectMenu()
			.setCustomId("quickReasons")
			.setPlaceholder(
				await client.bulbutils.translate("config_timezone_placeholder", interaction.guild?.id, {
					timezone: `${config.timezone} (${client.bulbutils.timezones[config.timezone]})`,
				}),
			)
			.setOptions(pages[currPage]),
	]);

	let pageRow = new MessageActionRow().addComponents([
		new MessageButton()
			.setCustomId("page-back")
			.setLabel("<")
			.setStyle("PRIMARY")
			.setDisabled(currPage === 0),
		new MessageButton()
			.setCustomId("page-next")
			.setLabel(">")
			.setStyle("PRIMARY")
			.setDisabled(currPage === 2),
	]);

	let buttonRow = new MessageActionRow().addComponents([
		new MessageButton()
			.setCustomId("back")
			.setLabel(await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}))
			.setStyle("DANGER"),
	]);

	await interaction.update({
		content: await client.bulbutils.translate("config_timezone_header", interaction.guild?.id, {}),
		components: [selectRow, pageRow, buttonRow],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "page-next":
					currPage++;
					// @ts-ignore
					selectRow.components[0].setOptions(pages[currPage]);
					pageRow.components[0].setDisabled(currPage === 0);
					pageRow.components[1].setDisabled(currPage === 2);

					await i.update({ components: [selectRow, pageRow, buttonRow] });
					break;
				case "page-back":
					currPage--;
					// @ts-ignore
					selectRow.components[0].setOptions(pages[currPage]);
					pageRow.components[0].setDisabled(currPage === 0);
					pageRow.components[1].setDisabled(currPage === 2);

					await i.update({ components: [selectRow, pageRow, buttonRow] });
					break;
				case "back":
					collector.stop();
					await require("./main").default(i, client);
					break;
			}
		} else if (i.isSelectMenu()) {
			await databaseManager.setTimezone(i.guild?.id as Snowflake, i.values[0]);
			await interaction.followUp({
				content: await client.bulbutils.translate("config_timezone_success", interaction.guild?.id, {
					timezone: `${i.values[0]} (${client.bulbutils.timezones[i.values[0]]})`,
				}),
				ephemeral: true,
			});
			collector.stop();

			await timezone(i, client);
		}
	});
}

export default timezone;

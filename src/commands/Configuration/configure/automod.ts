import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

async function automod(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("automod")
			.setPlaceholder("Automod")
			.setOptions([
				{ label: "Add/remove", value: "add_remove", description: "Add or remove an item from the selected automod category." },
				{ label: "Enable/Disable", value: "enable_disable", description: "Disable/Disable the selected automod category." },
				{ label: "Limit", value: "limit", description: "Set the limit of the selected automod category." },
				{ label: "Punishment", value: "punishment", description: "Set the punishment of the selected automod category." },
				{ label: "Overview", value: "overview", description: "View the automod categories and their settings." },
			]),
	);

	const backRow = new MessageActionRow().addComponents([new MessageButton().setCustomId("back").setLabel("Back").setStyle("DANGER")]);

	await interaction.update({ content: "Automod Configure", components: [selectRow, backRow] });

	const filter = i => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			await require("./main").default(i, client);
		} else if (i.isSelectMenu()) {
			switch (i.values[0]) {
				case "add_remove":
					await require("./automod/add").default(i, client);
					break;
			}
		}
	});
}

export default automod;

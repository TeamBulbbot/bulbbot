import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

async function automod(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const [header, back] = [await client.bulbutils.translate("config_automod_main_header", interaction.guild?.id, {}), await client.bulbutils.translate("config_button_back", interaction.guild?.id, {})];

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("automod")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{ label: "Add/remove", value: "add_remove", description: await client.bulbutils.translate("config_automod_main_add_remove_description", interaction.guild?.id, {}) },
				{ label: "Enable/Disable", value: "enable_disable", description: await client.bulbutils.translate("config_automod_main_enable_disable_description", interaction.guild?.id, {}) },
				{ label: "Limit", value: "limit", description: await client.bulbutils.translate("config_automod_main_limit_description", interaction.guild?.id, {}) },
				{ label: "Punishment", value: "punishment", description: await client.bulbutils.translate("config_automod_main_punishment_description", interaction.guild?.id, {}) },
				{ label: "Overview", value: "overview", description: await client.bulbutils.translate("config_automod_main_overview_description", interaction.guild?.id, {}) },
			]),
	);

	const backRow = new MessageActionRow().addComponents([new MessageButton().setCustomId("back").setLabel(back).setStyle("DANGER")]);

	await interaction[interaction.deferred ? "editReply" : "update"]({ content: header, components: [selectRow, backRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			await require("./main").default(i, client);
		} else if (i.isSelectMenu()) {
			const resolvedValue = i.values[0].split("_")[0];
			await require(`./automod/${resolvedValue}`).default(i, client);
		}
	});
}

export default automod;

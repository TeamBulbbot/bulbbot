import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import AutoModPart from "../../../../utils/types/AutoModPart";

const databaseManager: DatabaseManager = new DatabaseManager();

async function limit(interaction: MessageComponentInteraction, client: BulbBotClient, category?: string) {
	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("category")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{ label: "Messages", value: "messages", default: category === "messages" },
				{ label: "Mentions", value: "mentions", default: category === "mentions" },
			]),
	);

	const [back, update, header] = [
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_automod_limit_button_update", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_automod_limit_header", interaction.guild?.id, {}),
	];

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setLabel(back).setStyle("DANGER"),
		new MessageButton().setCustomId("update").setLabel(update).setStyle("PRIMARY").setDisabled(!category),
	]);

	interaction.deferred ? await interaction.editReply({ content: header, components: [selectRow, buttonRow] }) : await interaction.update({ content: header, components: [selectRow, buttonRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			if (i.customId === "back") {
				collector?.stop();
				return require("../automod").default(i, client);
			} else if (i.customId === "update") {
				collector?.stop();
				const messageFilter = (m: Message) => m.author.id === interaction.user.id;
				const messageCollector = interaction.channel?.createMessageCollector({ filter: messageFilter, time: 60000, max: 1 });
				await interaction.followUp({
					content: await client.bulbutils.translate("config_automod_limit_update_prompt", interaction.guild?.id, {}),
					ephemeral: true,
				});
				await i.deferUpdate();

				messageCollector?.on("collect", async (m: Message) => {
					await m.delete();
					const limits = m.content.split("/");

					if (limits.length !== 2) {
						await interaction.followUp({
							content: await client.bulbutils.translate("config_automod_limit_update_invalid_format", interaction.guild?.id, {}),
							ephemeral: true,
						});
						return limit(i, client, category);
					}

					const [items, seconds] = limits;

					if (isNaN(parseInt(items))) {
						await interaction.followUp({
							content: await client.bulbutils.translate("global_cannot_convert_special", interaction.guild?.id, {
								arg_provided: items,
								arg_expected: "number",
							}),
							ephemeral: true,
						});
						return limit(i, client, category);
					} else if (isNaN(parseInt(seconds))) {
						await interaction.followUp({
							content: await client.bulbutils.translate("global_cannot_convert_special", interaction.guild?.id, {
								arg_provided: seconds,
								arg_expected: "number",
							}),
							ephemeral: true,
						});
						return limit(i, client, category);
					} else if (parseInt(items) <= 0) {
						await interaction.followUp({
							content: await client.bulbutils.translate("config_automod_limit_update_items_too_short", interaction.guild?.id, {}),
							ephemeral: true,
						});
						return limit(i, client, category);
					} else if (parseInt(seconds) <= 3) {
						await interaction.followUp({
							content: await client.bulbutils.translate("config_automod_limit_update_seconds_too_short", interaction.guild?.id, {}),
							ephemeral: true,
						});
						return limit(i, client, category);
					} else if (parseInt(seconds) > 30) {
						await interaction.followUp({
							content: await client.bulbutils.translate("config_automod_limit_update_seconds_too_long", interaction.guild?.id, {}),
							ephemeral: true,
						});
						return limit(i, client, category);
					}

					if (category !== undefined) await databaseManager.automodSetLimit(interaction.guild?.id as Snowflake, parts[category], parseInt(items));
					if (category !== undefined) await databaseManager.automodSetTimeout(interaction.guild?.id as Snowflake, parts[category], parseInt(seconds) * 1000);
					await interaction.followUp({ content: `Updated to ${items}/${seconds}`, ephemeral: true });

					return limit(i, client, category);
				});
			}
		} else if (i.isSelectMenu()) {
			collector?.stop();
			return limit(i, client, i.values[0]);
		}
	});
}

const parts = {
	messages: AutoModPart.message,
	mentions: AutoModPart.mention,
};

export default limit;

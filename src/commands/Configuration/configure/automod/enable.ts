import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import { AutoModConfiguration } from "../../../../utils/types/DatabaseStructures";
import AutoModPart from "../../../../utils/types/AutoModPart";

const databaseManager: DatabaseManager = new DatabaseManager();

async function enable(interaction: MessageComponentInteraction, client: BulbBotClient, category?: string): Promise<void> {
	const config: AutoModConfiguration = await databaseManager.getAutoModConfig(interaction.guild?.id as Snowflake);
	const selectedCategory: string | undefined = category;

	const selectRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("enable-disable")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{ label: "Website filter", value: "punishmentWebsite", default: selectedCategory === "punishmentWebsite" },
				{ label: "Invite filter", value: "punishmentInvites", default: selectedCategory === "punishmentInvites" },
				{ label: "Word filter", value: "punishmentWords", default: selectedCategory === "punishmentWords" },
				{ label: "Mention filter", value: "punishmentMentions", default: selectedCategory === "punishmentMentions" },
				{ label: "Message filter", value: "punishmentMessages", default: selectedCategory === "punishmentMessages" },
				{ label: "Avatar filter", value: "punishmentAvatarBans", default: selectedCategory === "punishmentAvatarBans" },
			]),
	);

	const [backButton, enableButton, disableButton] = [
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_button_enable", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_button_disable", interaction.guild?.id, {}),
	];

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setLabel(backButton).setStyle("DANGER"),
		new MessageButton()
			.setCustomId("enable")
			.setLabel(enableButton)
			.setStyle("SUCCESS")
			.setDisabled(selectedCategory !== undefined || config.enabled),
		new MessageButton()
			.setCustomId("disable")
			.setLabel(disableButton)
			.setStyle("PRIMARY")
			.setDisabled(!config.enabled || (!!selectedCategory && config[selectedCategory] === null)),
	]);

	await interaction.update({
		content: await client.bulbutils.translate("config_enable_disable_header", interaction.guild?.id, {}),
		components: [selectRow, buttonRow],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "back":
					collector.stop();
					await require("../automod").default(i, client);
					break;
				case "disable":
					collector.stop();
					if (selectedCategory === undefined) {
						await databaseManager.enableAutomod(interaction.guild?.id as Snowflake, false);
						await interaction.followUp({
							content: await client.bulbutils.translate("config_enable_disable_disable_generic_success", interaction.guild?.id, {}),
							ephemeral: true,
						});

						await enable(i, client);
					} else {
						await databaseManager.automodSetPunishment(interaction.guild?.id as Snowflake, parts[selectedCategory!], null);
						await interaction.followUp({
							content: await client.bulbutils.translate("config_enable_disable_disable_success", interaction.guild?.id, {}),
							ephemeral: true,
						});

						await enable(i, client);
					}

					break;
				case "enable":
					collector.stop();
					await databaseManager.enableAutomod(interaction.guild?.id as Snowflake, true);
					await interaction.followUp({
						content: await client.bulbutils.translate("config_enable_disable_enable_success", interaction.guild?.id, {}),
						ephemeral: true,
					});

					await enable(i, client);
			}
		} else if (i.isSelectMenu()) {
			collector.stop();
			await enable(i, client, i.values[0]);
		}
	});
}

const parts = {
	punishmentWebsite: AutoModPart.website,
	punishmentInvites: AutoModPart.invite,
	punishmentWords: AutoModPart.word,
	punishmentMentions: AutoModPart.mention,
	punishmentMessages: AutoModPart.message,
	punishmentAvatarBans: AutoModPart.avatars,
};

export default enable;

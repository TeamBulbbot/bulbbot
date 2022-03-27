import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, Snowflake } from "discord.js";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import PunishmentType from "../../../../utils/types/PunishmentType";
import AutoModPart from "../../../../utils/types/AutoModPart";
import { AutoModConfiguration } from "../../../../utils/types/DatabaseStructures";
import * as Emotes from "../../../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

async function punishment(interaction: MessageComponentInteraction, client: BulbBotClient, selectedCategory?: string) {
	const config: AutoModConfiguration = await databaseManager.getAutoModConfig(interaction.guild?.id as Snowflake);

	const selectRow = new MessageActionRow().setComponents(
		new MessageSelectMenu()
			.setCustomId("category")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{ label: "Website filter", value: "punishmentWebsite", default: selectedCategory === "punishmentWebsite" },
				{ label: "Invite filter", value: "punishmentInvites", default: selectedCategory === "punishmentInvites" },
				{ label: "Word filter", value: "punishmentWords", default: selectedCategory === "punishmentWords" },
				{ label: "Avatar hashes", value: "punishmentAvatarBans", default: selectedCategory === "punishmentAvatarBans" },
				{ label: "Messages filter", value: "punishmentMessages", default: selectedCategory === "punishmentMessages" },
				{ label: "Mentions filter", value: "punishmentMentions", default: selectedCategory === "punishmentMentions" },
			]),
	);

	const punishmentRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("punishment")
			.setPlaceholder(await client.bulbutils.translate("config_punishment_select_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{
					label: "Log",
					value: "log",
					description: await client.bulbutils.translate("config_punishment_description_log", interaction.guild?.id, {}),
					default: !!(selectedCategory && config[selectedCategory] === "LOG"),
					emoji: selectedCategory && config[selectedCategory] === "LOG" ? Emotes.status.ONLINE : Emotes.status.DND,
				},
				{
					label: "Warn",
					value: "warn",
					description: await client.bulbutils.translate("config_punishment_description_warn", interaction.guild?.id, {}),
					default: !!(selectedCategory && config[selectedCategory] === "WARN"),
					emoji: selectedCategory && config[selectedCategory] === "WARN" ? Emotes.status.ONLINE : Emotes.status.DND,
				},
				{
					label: "Kick",
					value: "kick",
					description: await client.bulbutils.translate("config_punishment_description_kick", interaction.guild?.id, {}),
					default: !!(selectedCategory && config[selectedCategory] === "KICK"),
					emoji: selectedCategory && config[selectedCategory] === "KICK" ? Emotes.status.ONLINE : Emotes.status.DND,
				},
				{
					label: "Ban",
					value: "ban",
					description: await client.bulbutils.translate("config_punishment_description_ban", interaction.guild?.id, {}),
					default: !!(selectedCategory && config[selectedCategory] === "BAN"),
					emoji: selectedCategory && config[selectedCategory] === "BAN" ? Emotes.status.ONLINE : Emotes.status.DND,
				},
			])
			.setDisabled(!selectedCategory),
	);

	const buttonRow = new MessageActionRow().setComponents(
		new MessageButton()
			.setCustomId("back")
			.setLabel(await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}))
			.setStyle("DANGER"),
	);

	await interaction.update({
		content: await client.bulbutils.translate("config_punishment_header", interaction.guild?.id, {}),
		components: [selectRow, punishmentRow, buttonRow],
	});

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			collector.stop();
			return require("../automod").default(i, client);
		} else if (i.isSelectMenu()) {
			if (i.customId === "category") {
				collector.stop();
				return punishment(i, client, i.values[0]);
			} else if (i.customId === "punishment") {
				collector.stop();
				await databaseManager.automodSetPunishment(interaction.guild?.id as Snowflake, categories[selectedCategory!], punishmentTypes[i.values[0]]);
				return punishment(i, client, selectedCategory);
			}
		}
	});
}

const punishmentTypes = {
	log: PunishmentType.LOG,
	warn: PunishmentType.WARN,
	kick: PunishmentType.KICK,
	ban: PunishmentType.BAN,
};

const categories = {
	punishmentWebsite: AutoModPart.website,
	punishmentInvites: AutoModPart.invite,
	punishmentWords: AutoModPart.word,
	punishmentMessages: AutoModPart.message,
	punishmentMentions: AutoModPart.mention,
	punishmentAvatarBans: AutoModPart.avatars,
};

export default punishment;

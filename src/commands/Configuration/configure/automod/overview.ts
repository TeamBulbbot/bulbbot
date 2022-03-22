import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { AutoModConfiguration } from "../../../../utils/types/DatabaseStructures";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import * as Emotes from "../../../../emotes.json";
import { embedColor } from "../../../../Config";

const databaseManager: DatabaseManager = new DatabaseManager();

async function overview(interaction: MessageComponentInteraction, client: BulbBotClient) {
	const dbGuild: AutoModConfiguration = await databaseManager.getAutoModConfig(interaction.guild!.id);

	const roles: string[] = [];
	const channels: string[] = [];
	const users: string[] = [];

	dbGuild.ignoreRoles.length ? dbGuild.ignoreRoles.forEach(role => roles.push(`<@&${role}>`)) : roles.push("None");
	dbGuild.ignoreChannels.length ? dbGuild.ignoreChannels.forEach(channel => channels.push(`<#${channel}>`)) : channels.push("None");
	dbGuild.ignoreUsers.length ? dbGuild.ignoreUsers.forEach(user => users.push(`<@${user}>`)) : users.push("None");

	const description: string[] = [];

	description.push(
		await client.bulbutils.translate("automod_settings_enabled", interaction.guild?.id, {
			enabled: dbGuild.enabled ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_websites", interaction.guild?.id, {
			enabled: dbGuild.punishmentWebsite !== null ? `\`${dbGuild.punishmentWebsite}\`` : Emotes.other.SWITCHOFF,
			websites_blacklist: dbGuild.websiteWhitelist.length ? dbGuild.websiteWhitelist.map(web => `\`${web}\``).join(" ") : "None",
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_invites", interaction.guild?.id, {
			enabled: dbGuild.punishmentInvites !== null ? `\`${dbGuild.punishmentInvites}\`` : Emotes.other.SWITCHOFF,
			invites_blacklist: dbGuild.inviteWhitelist.length ? dbGuild.inviteWhitelist.map(i => `\`${i}\``).join(" ") : "None",
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_words", interaction.guild?.id, {
			enabled: dbGuild.punishmentWords !== null ? `\`${dbGuild.punishmentWords}\`` : Emotes.other.SWITCHOFF,
			word_blacklist: dbGuild.wordBlacklist.length ? dbGuild.wordBlacklist.join(" ") : "None",
			word_token_blacklist: dbGuild.wordBlacklistToken.length ? dbGuild.wordBlacklistToken.map(w => `\`${w}\``).join(" ") : "None",
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_mentions", interaction.guild?.id, {
			enabled: dbGuild.punishmentMentions ? `\`${dbGuild.punishmentMentions}\`` : Emotes.other.SWITCHOFF,
			limit: dbGuild.limitMentions,
			timeout: dbGuild.timeoutMentions / 1000,
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_messages", interaction.guild?.id, {
			enabled: dbGuild.punishmentMessages ? `\`${dbGuild.punishmentMessages}\`` : Emotes.other.SWITCHOFF,
			limit: dbGuild.limitMessages,
			timeout: dbGuild.timeoutMessages / 1000,
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_avatarbans", interaction.guild?.id, {
			enabled: dbGuild.punishmentAvatarBans !== null ? `\`${dbGuild.punishmentAvatarBans}\`` : Emotes.other.SWITCHOFF,
			avatar_blacklist: dbGuild.avatarHashes.length ? dbGuild.avatarHashes.map(h => `\`${h}\``).join(" ") : "None",
		}),
	);

	description.push(
		await client.bulbutils.translate("automod_settings_ignored", interaction.guild?.id, {
			roles: roles.join(" "),
			channels: channels.join(" "),
			users: users.join(" "),
		}),
	);

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor({
			name: await client.bulbutils.translate("automod_settings_header", interaction.guild?.id, { guild: interaction.guild }),
			iconURL: interaction.guild!.iconURL({ dynamic: true }) ?? undefined,
		})
		.setDescription(description.join("\n\n"))
		.setFooter({
			text: await client.bulbutils.translate("automod_settings_footer", interaction.guild?.id, {}),
			iconURL: "https://cdn.discordapp.com/emojis/833770837575860305.png?v=1",
		});

	const buttonRow = new MessageActionRow().setComponents(
		new MessageButton()
			.setCustomId("back")
			.setLabel(await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}))
			.setStyle("DANGER"),
	);

	await interaction.update({ embeds: [embed], components: [buttonRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.customId === "back") {
			return require("../automod").default(i, client);
		}
	});
}

export default overview;

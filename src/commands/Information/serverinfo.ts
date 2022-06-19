import { CommandInteraction, Emoji, Guild, GuildChannel, GuildFeatures, MessageEmbed, Role } from "discord.js";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import * as Emotes from "../../emotes.json";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "../../utils/types/ApplicationCommands";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "server_info",
			description: "Returns some useful information about the current server",
			type: ApplicationCommandType.CHAT_INPUT,
			command_permissions: ["MANAGE_GUILD"],
			client_permissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let description = "";

		description += await this.client.bulbutils.translate("serverinfo_embed_owner", interaction.guild?.id, { guild: interaction.guild as Guild });
		description += await this.client.bulbutils.translate("serverinfo_embed_features", interaction.guild?.id, {
			guild_features: this.client.bulbutils.guildFeatures(interaction.guild?.features as GuildFeatures[]),
		});
		description += await this.client.bulbutils.translate("serverinfo_embed_verification", interaction.guild?.id, { guild: interaction.guild as Guild });
		description += await this.client.bulbutils.translate("serverinfo_embed_created", interaction.guild?.id, { guild_age: Math.floor((interaction.guild?.createdTimestamp as number) / 1000) });

		let serverStats = "";
		serverStats += await this.client.bulbutils.translate("serverinfo_server_stats_total", interaction.guild?.id, { guild: interaction.guild as Guild });

		let channelStats = "";
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_text", interaction.guild?.id, {
			// @ts-expect-error
			guild_text: interaction.guild?.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_TEXT").size,
			emote_text: Emotes.channel.TEXT,
		});
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_announcement", interaction.guild?.id, {
			// @ts-expect-error
			guild_announcement: interaction.guild?.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_NEWS").size,
			emote_announcement: Emotes.channel.ANNOUNCEMENT,
		});
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_voice", interaction.guild?.id, {
			// @ts-expect-error
			guild_voice: interaction.guild?.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_VOICE").size,
			emote_voice: Emotes.channel.VOICE,
		});
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_stage", interaction.guild?.id, {
			// @ts-expect-error
			guild_stage: interaction.guild?.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_STAGE_VOICE").size,
			emote_stage: Emotes.channel.STAGE,
		});
		channelStats += await this.client.bulbutils.translate("serverinfo_channel_stats_category", interaction.guild?.id, {
			// @ts-expect-error
			guild_category: interaction.guild?.channels.cache.filter((ch: GuildChannel) => ch.type === "GUILD_CATEGORY").size,
			emote_category: Emotes.channel.CATEGORY,
		});

		let boosterStats = "";
		boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier", interaction.guild?.id, { guild: interaction.guild as Guild });
		boosterStats += await this.client.bulbutils.translate("serverinfo_booster_boosters", interaction.guild?.id, { guild: interaction.guild as Guild });
		if (interaction.guild?.premiumTier === "TIER_1") boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_1", interaction.guild?.id, { guild: interaction.guild as Guild });
		else if (interaction.guild?.premiumTier === "TIER_2")
			boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_2", interaction.guild?.id, { guild: interaction.guild as Guild });
		else if (interaction.guild?.premiumTier === "TIER_3")
			boosterStats += await this.client.bulbutils.translate("serverinfo_booster_tier_3", interaction.guild?.id, { guild: interaction.guild as Guild });

		const guildRoles: Role[] = [];
		const guildEmotes: Emoji[] = [];
		let rolesLeft = 0;
		let amountOfRoles = 0;
		let emotesLeft = 0;
		let amountOfEmotes = 0;
		interaction.guild?.roles.cache.forEach((role) => {
			amountOfRoles++;
			if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
			else rolesLeft++;
		});
		interaction.guild?.emojis.cache.forEach((emote) => {
			amountOfEmotes++;
			if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
			else emotesLeft++;
		});

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setThumbnail(interaction.guild?.iconURL({ dynamic: true }) || "")
			.setAuthor({
				name: interaction.guild?.name || "",
				iconURL: interaction.guild?.iconURL({ dynamic: true }) ?? undefined,
			})
			.addField(await this.client.bulbutils.translate("serverinfo_server_stats", interaction.guild?.id, {}), serverStats, true)
			.addField(await this.client.bulbutils.translate("serverinfo_channel_stats", interaction.guild?.id, {}), channelStats, true)
			.addField(await this.client.bulbutils.translate("serverinfo_booster_stats", interaction.guild?.id, {}), boosterStats, true)
			.addField(
				await this.client.bulbutils.translate("serverinfo_roles", interaction.guild?.id, { guild_amount_roles: amountOfRoles }),
				`${guildRoles.join(" ")} ${rolesLeft !== 0 ? await this.client.bulbutils.translate("serverinfo_roles_too_many", interaction.guild?.id, { guild_roles_left: rolesLeft }) : ""}`,
				true,
			)
			.addField(
				await this.client.bulbutils.translate("serverinfo_emotes", interaction.guild?.id, { guild_amount_emotes: amountOfEmotes }),
				amountOfEmotes !== 0
					? `${guildEmotes.join(" ")} ${emotesLeft !== 0 ? await this.client.bulbutils.translate("serverinfo_emotes_too_many", interaction.guild?.id, { guild_emotes_left: emotesLeft }) : ""}`
					: await this.client.bulbutils.translate("serverinfo_emotes_none", interaction.guild?.id, {}),
				true,
			)
			.setDescription(description)
			.setImage(interaction.guild?.splash !== null ? `https://cdn.discordapp.com/splashes/${interaction.guild?.id}/${interaction.guild?.splash}.png?size=4096` : "")
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}
}

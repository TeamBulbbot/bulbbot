import {
	ButtonInteraction,
	ColorResolvable,
	CommandInteraction,
	GuildMember,
	GuildTextBasedChannel,
	MessageActionRow,
	MessageButton,
	User,
	MessageEmbed,
	Modal,
	TextInputComponent,
	Guild,
} from "discord.js";
import axios from "axios";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import * as Emotes from "../../emotes.json";
import { discordApi, embedColor, supportInvite } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { isNullish, resolveGuildMemberMoreSafe } from "../../utils/helpers";
import { APIGuildMember, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";
import { BanType } from "../../utils/types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class UserInfo extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a user",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "user",
					type: ApplicationCommandOptionType.User,
					description: "The user you want to view more info about",
					required: false,
				},
			],
			command_permissions: ["MUTE_MEMBERS"],
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let user: User | GuildMember;
		let color: ColorResolvable;
		let badges = "";
		let description = "";

		if (interaction.options.getMember("user") !== null) user = resolveGuildMemberMoreSafe(interaction.options.getMember("user") as GuildMember | APIGuildMember);
		else if (interaction.options.getUser("user") !== null) user = interaction.options.getUser("user") as User;
		else user = resolveGuildMemberMoreSafe(interaction.member as GuildMember | APIGuildMember);

		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Warn").setStyle("SECONDARY").setEmoji(Emotes.actions.WARN).setCustomId("warn"),
			new MessageButton().setLabel("Kick").setStyle("SECONDARY").setEmoji(Emotes.actions.KICK).setCustomId("kick"),
			new MessageButton().setLabel("Ban").setStyle("DANGER").setEmoji(Emotes.actions.BAN).setCustomId("ban"),
		]);

		const rowDisabled = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Warn").setStyle("SECONDARY").setEmoji(Emotes.actions.WARN).setCustomId("warn").setDisabled(true),
			new MessageButton().setLabel("Kick").setStyle("SECONDARY").setEmoji(Emotes.actions.KICK).setCustomId("kick").setDisabled(true),
			new MessageButton().setLabel("Ban").setStyle("DANGER").setEmoji(Emotes.actions.BAN).setCustomId("ban").setDisabled(true),
		]);

		let components: MessageActionRow[];
		if (isNullish(interaction.guild)) return;

		const { actionsOnInfo } = await databaseManager.getConfig(interaction.guild);

		if (!actionsOnInfo) components = [];
		else if (!(user instanceof GuildMember)) components = [];
		else if (user.user.id === interaction.user.id) components = [];
		else if (user instanceof User && user.id === interaction.user.id) components = [];
		else if (user.user.id === interaction.applicationId) components = [];
		else if (user.user.bot || (user instanceof GuildMember && user.user.bot)) components = [];
		else components = [row];

		if (user instanceof GuildMember) {
			if (user.user.flags !== null) badges += this.client.bulbutils.userFlags(user.user.flags.bitfield).join(" ");
			description += await this.client.bulbutils.translate("userinfo_embed_id", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", interaction.guild?.id, { user: user.user });
			if (user.nickname) description += await this.client.bulbutils.translate("userinfo_embed_nickname", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", interaction.guild?.id, { avatar: user.user.displayAvatarURL() });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", interaction.guild?.id, { bot: user.user.bot ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF });
			description += await this.client.bulbutils.translate("userinfo_embed_created", interaction.guild?.id, { user_age: Math.floor(user.user.createdTimestamp / 1000) });

			if (user.premiumSinceTimestamp !== undefined && user.premiumSinceTimestamp && user.premiumSinceTimestamp > 0)
				description += await this.client.bulbutils.translate("userinfo_embed_premium", interaction.guild?.id, {
					user_premium: Math.floor(user.premiumSinceTimestamp / 1000),
				});

			if (user.joinedTimestamp !== undefined && user.joinedTimestamp)
				description += await this.client.bulbutils.translate("userinfo_embed_joined", interaction.guild?.id, { user_joined: Math.floor(user.joinedTimestamp / 1000) });

			if (user.roles !== undefined && user.roles)
				description += await this.client.bulbutils.translate("userinfo_embed_roles", interaction.guild?.id, {
					user_roles: user.roles.cache.map((r: any) => `${r}`).join(" "),
				});

			if (user.user.hexAccentColor) color = user.user.hexAccentColor;
			else if (user.roles === undefined || user.roles.highest.name === "@everyone") color = embedColor;
			else color = user.roles.highest.hexColor;
		} else {
			if (user.flags !== null) badges += this.client.bulbutils.userFlags(user.flags.bitfield).join(" ");
			description += await this.client.bulbutils.translate("userinfo_embed_id", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", interaction.guild?.id, { avatar: user.displayAvatarURL() });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", interaction.guild?.id, { bot: user.bot ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF });
			description += await this.client.bulbutils.translate("userinfo_embed_created", interaction.guild?.id, { user_age: Math.floor(user.createdTimestamp / 1000) });

			color = embedColor;
		}

		if (user instanceof GuildMember ? user.user.bot : user.bot) {
			let data: any | boolean;
			try {
				data = await axios.get(`${discordApi}/applications/${user.id}/rpc`, {});
				data = data.data;
			} catch (error) {
				data = false;
			}

			if (data) {
				description += await this.client.bulbutils.translate("userinfo_embed_bot_info", interaction.guild?.id, {});
				if (data.summary !== "") description += `\n> ${data.summary.split("\n").join(" ")}`;
				if (data.tags) description += await this.client.bulbutils.translate("userinfo_embed_bot_tags", interaction.guild?.id, { tags: data.tags.map((t: any) => `\`${t}\``).join(" ") });

				description += await this.client.bulbutils.translate("userinfo_embed_bot_public", interaction.guild?.id, { emoji: data.bot_public ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF });
				description += await this.client.bulbutils.translate("userinfo_embed_bot_requires_code", interaction.guild?.id, {
					emoji: data.bot_require_code_grant ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
				});
				const botflags = this.client.bulbutils.applicationFlags(data.flags);

				if (botflags.includes("SUPPORTS_SLASH_COMMANDS")) badges += Emotes.flags.SUPPORTS_COMMANDS;

				description += await this.client.bulbutils.translate("userinfo_embed_bot_presence_intent", interaction.guild?.id, {
					emoji: badges.includes(Emotes.flags.VERIFIED_BOT) ? (botflags.includes("GATEWAY_PRESENCE") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF) : Emotes.other.MAYBE,
				});
				description += await this.client.bulbutils.translate("userinfo_embed_server_memebers_intent", interaction.guild?.id, {
					emoji: badges.includes(Emotes.flags.VERIFIED_BOT) ? (botflags.includes("GATEWAY_GUILD_MEMBERS") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF) : Emotes.other.MAYBE,
				});
				description += await this.client.bulbutils.translate("userinfo_embed_bot_message_content_intent", interaction.guild?.id, {
					emoji: badges.includes(Emotes.flags.VERIFIED_BOT) ? (botflags.includes("GATEWAY_MESSAGE_CONTENT") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF) : Emotes.other.MAYBE,
				});

				const links: string[] = [];
				if (data.privacy_policy_url) links.push(`[**Privacy Policy**](${data.privacy_policy_url})`);
				if (data.terms_of_service_url) links.push(`[**Terms of Service**](${data.terms_of_service_url})`);
				if (data.install_params)
					links.push(`[**Add the bot**](https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=${data.install_params.permissions}&scope=${data.install_params.scopes.join("+")})`);
				if (data.custom_install_url) links.push(`[**Add the bot**](${data.custom_install_url})`);

				if (links.length === 1) description += `\n${links[0]}`;
				else if (links.length > 1) description += `\n${links.join(" **•** ")}`;
			}
		}

		if (badges !== "") badges += "\n";

		const infs = await infractionsManager.getOffenderInfractions({ guildId: interaction.guild.id, targetId: user.id });
		if (infs) {
			let inf_emote: string;

			if (infs.length <= 1) inf_emote = Emotes.status.ONLINE;
			else if (infs.length === 2) inf_emote = Emotes.other.INF1;
			else inf_emote = Emotes.other.INF2;

			description += await this.client.bulbutils.translate("userinfo_embed_infractions", interaction.guild?.id, { inf_emote, user_infractions: infs.length });
		}

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(color)
			.setThumbnail(user instanceof GuildMember ? (user.user.avatarURL() as string) : (user.avatarURL() as string) || "")
			.setAuthor({
				name: `${user instanceof GuildMember ? user.user.username : user.username}#${user instanceof GuildMember ? user.user.discriminator : user.discriminator}`,
				iconURL: user instanceof GuildMember ? (user.user.avatarURL() as string) : (user.avatarURL() as string) || "",
			})
			.setDescription(`${badges}${description}`)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL() || "",
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed], components });

		const collector = (interaction.channel as GuildTextBasedChannel).createMessageComponentCollector({
			componentType: "BUTTON",
			filter: (i: any) => ["warn", "kick", "ban"].includes(i.customId) && i.user.id === interaction.user.id,
			time: 60000,
			max: 1,
		});

		collector.on("collect", async (buttonInteraction: ButtonInteraction) => {
			const command = this.client.commands.get(buttonInteraction.customId);

			if (!command) {
				interaction.editReply({ components: [rowDisabled] });
				return void (await buttonInteraction.reply({
					content: await this.client.bulbutils.translate("global_error.unknown", buttonInteraction.guildId, { discord_invite: supportInvite }),
					ephemeral: true,
				}));
			}

			const modal = new Modal().setCustomId("reasonModal").setTitle("Reason");
			const reasonInput = new TextInputComponent().setCustomId("reason").setLabel(`Reason for the ${buttonInteraction.customId}`).setStyle("SHORT");

			// @ts-expect-error
			const row = new MessageActionRow().addComponents([reasonInput]);

			// @ts-expect-error
			modal.addComponents(row);

			await buttonInteraction.showModal(modal);
			const modalResponse = await buttonInteraction.awaitModalSubmit({ filter: (i: any) => i.customId === "reasonModal" && i.user.id === interaction.user.id, time: 15_000 });

			const reason = modalResponse.fields.getTextInputValue("reason");

			let infId = -1;

			switch (buttonInteraction.customId) {
				case "warn":
					infId = await infractionsManager.warn(
						this.client,
						interaction.guild as Guild,
						user as User,
						interaction.member as GuildMember,
						await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
							moderator: interaction.user,
							target: user instanceof GuildMember ? user.user : user,
							reason,
						}),
						reason,
					);
					break;

				case "kick":
					// @ts-expect-error
					infId = await infractionsManager.kick(
						this.client,
						interaction.guild as Guild,
						user as GuildMember,
						interaction.member as GuildMember,
						await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.kick", interaction.guild?.id, {}),
							moderator: interaction.user,
							target: user instanceof GuildMember ? user.user : user,
							reason,
						}),
						reason,
					);
					break;

				case "ban":
					infId = await infractionsManager.ban(
						this.client,
						interaction.guild as Guild,
						BanType.FORCE,
						user as User,
						interaction.member as GuildMember,
						await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.force_ban", interaction.guild?.id, {}),
							moderator: interaction.user,
							target: user instanceof GuildMember ? user.user : user,
							reason,
						}),
						reason as string,
						0,
					);
					break;

				default:
					break;
			}

			modalResponse.reply({
				content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
					// @ts-expect-error
					action: await this.client.bulbutils.translate(`mod_action_types.${buttonInteraction.customId}`, interaction.guild?.id, {}),
					target: user instanceof GuildMember ? user.user : user,
					reason,
					infraction_id: infId,
				}),
			});

			return;
		});

		collector.on("end", async () => {
			if (components.length === 0) return;
			interaction.editReply({ components: [rowDisabled] });
		});
	}
}

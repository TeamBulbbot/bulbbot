import { ColorResolvable, CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import axios from "axios";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import * as Emotes from "../../emotes.json";
import { discordApi, embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "../../utils/types/ApplicationCommands";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { isNullish, resolveGuildMemberMoreSafe } from "../../utils/helpers";
import { APIGuildMember } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();
export default class extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "user_info",
			description: "Returns some useful info about a user",
			type: ApplicationCommandType.CHAT_INPUT,
			options: [{ name: "user", type: ApplicationCommandOptionTypes.USER, description: "The user you want to view more info about", required: false }],
			command_permissions: ["MUTE_MEMBERS"],
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let user: User | GuildMember;
		let color: ColorResolvable;

		if (interaction.options.getMember("user") !== null) user = resolveGuildMemberMoreSafe(interaction.options.getMember("user") as GuildMember | APIGuildMember);
		else if (interaction.options.getUser("user") !== null) user = interaction.options.getUser("user") as User;
		else user = resolveGuildMemberMoreSafe(interaction.member as GuildMember | APIGuildMember);

		const target: string = user instanceof GuildMember ? user.user.id : user.id;

		// const row = new MessageActionRow().addComponents([
		// 	new MessageButton().setLabel("Warn").setStyle("SECONDARY").setEmoji(Emotes.actions.WARN).setCustomId("warn"),
		// 	new MessageButton().setLabel("Kick").setStyle("SECONDARY").setEmoji(Emotes.actions.KICK).setCustomId("kick"),
		// 	new MessageButton().setLabel("Ban").setStyle("DANGER").setEmoji(Emotes.actions.BAN).setCustomId("ban"),
		// ]);

		const rowDisabled = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Warn").setStyle("SECONDARY").setEmoji(Emotes.actions.WARN).setCustomId("warn").setDisabled(true),
			new MessageButton().setLabel("Kick").setStyle("SECONDARY").setEmoji(Emotes.actions.KICK).setCustomId("kick").setDisabled(true),
			new MessageButton().setLabel("Ban").setStyle("DANGER").setEmoji(Emotes.actions.BAN).setCustomId("ban").setDisabled(true),
		]);

		let components: MessageActionRow[];
		if (isNullish(interaction.guild)) {
			return;
		}
		const { actionsOnInfo } = await databaseManager.getConfig(interaction.guild);

		if (!actionsOnInfo) components = [];
		else if (!(user instanceof GuildMember)) components = [];
		else if (user.user.id === interaction.user.id) components = [];
		else if (user instanceof User && user.id === interaction.user.id) components = [];
		else if (user.user.id === interaction.applicationId) components = [];
		else components = [rowDisabled];

		let description = "";
		if (user instanceof GuildMember) {
			if (user.user.flags !== null) description += this.client.bulbutils.badges(user.user.flags.bitfield) + "\n";
			description += await this.client.bulbutils.translate("userinfo_embed_id", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", interaction.guild?.id, { user: user.user });
			if (user.nickname) description += await this.client.bulbutils.translate("userinfo_embed_nickname", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", interaction.guild?.id, { avatar: user.user.displayAvatarURL({ dynamic: true }) });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", interaction.guild?.id, { user: user.user });
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

			if (user.roles === undefined || user.roles.highest.name === "@everyone") color = embedColor;
			else color = user.roles.highest.hexColor;
		} else {
			if (user.flags !== null) description += this.client.bulbutils.badges(user.flags.bitfield) + "\n";
			description += await this.client.bulbutils.translate("userinfo_embed_id", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", interaction.guild?.id, { avatar: user.displayAvatarURL({ dynamic: true }) });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", interaction.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_created", interaction.guild?.id, { user_age: Math.floor(user.createdTimestamp / 1000) });

			color = embedColor;
		}

		if (user instanceof GuildMember ? user.user.bot : user.bot) {
			let data: any | boolean;
			try {
				data = await axios.get(`${discordApi}/applications/${target}/rpc`, {});
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

				description += await this.client.bulbutils.translate("userinfo_embed_bot_presence_intent", interaction.guild?.id, {
					emoji: botflags.includes("GATEWAY_PRESENCE") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
				});
				description += await this.client.bulbutils.translate("userinfo_embed_server_memebers_intent", interaction.guild?.id, {
					emoji: botflags.includes("GATEWAY_GUILD_MEMBERS") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
				});
				description += await this.client.bulbutils.translate("userinfo_embed_bot_message_content_intent", interaction.guild?.id, {
					emoji: botflags.includes("GATEWAY_MESSAGE_CONTENT") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
				});

				const links: string[] = [];
				if (data.privacy_policy_url) links.push(`[**Privacy Policy**](${data.privacy_policy_url})`);
				if (data.terms_of_service_url) links.push(`[**Terms of Service**](${data.terms_of_service_url})`);
				if (data.install_params)
					links.push(`[**Add the bot**](https://discord.com/oauth2/authorize?client_id=${target}&permissions=${data.install_params.permissions}&scope=${data.install_params.scopes.join("+")})`);
				if (data.custom_install_url) links.push(`[**Add the bot**](${data.custom_install_url})`);

				if (links.length === 1) description += `\n${links[0]}`;
				else if (links.length > 1) description += `\n${links.join(" **•** ")}`;
			}
		}

		const infs = await infractionsManager.getOffenderInfractions({ guildId: interaction.guild.id, targetId: user instanceof GuildMember ? user.user.id : user.id });
		if (infs) {
			let inf_emote;

			if (infs.length <= 1) inf_emote = Emotes.status.ONLINE;
			else if (infs.length === 2) inf_emote = Emotes.other.INF1;
			else inf_emote = Emotes.other.INF2;

			description += await this.client.bulbutils.translate("userinfo_embed_infractions", interaction.guild?.id, { inf_emote, user_infractions: infs.length });
		}

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(color)
			.setThumbnail(user instanceof GuildMember ? (user.user.avatarURL({ dynamic: true }) as string) : (user.avatarURL({ dynamic: true }) as string) || "")
			.setAuthor({
				name: `${user instanceof GuildMember ? user.user.username : user.username}#${user instanceof GuildMember ? user.user.discriminator : user.discriminator}`,
				iconURL: user instanceof GuildMember ? (user.user.avatarURL() as string) : (user.avatarURL() as string) || "",
			})
			.setDescription(description)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed], components });

		// TODO: Implement button click logic once the corresponding commands have been migrated
	}
}

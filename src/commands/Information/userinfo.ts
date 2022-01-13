import Command from "../../structures/Command";
import CommandContext, { getCommandContext } from "../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from "discord.js";
import axios from "axios";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import * as Emotes from "../../emotes.json";
import { discordApi, embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();

type ButtonActionType = "warn" | "kick" | "ban";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a user",
			category: "Information",
			aliases: ["whois", "info", "user"],
			usage: "[user]",
			examples: ["userinfo", "userinfo 123456789012345678", "userinfo @Wumpus#0000"],
			clearance: 50,
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// await context.guild?.members.fetch();

		let target: string;
		if (args[0] === undefined) target = context.author.id;
		else target = args[0].replace(NonDigits, "");

		let user: any = await this.client.bulbfetch.getGuildMember(context.guild?.members, target);
		let isGuildMember = true;

		if (!user) user = await this.client.bulbfetch.getUser(target);
		if (!user)
			return await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_expected: "user:User",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		user = this.client.bulbutils.userObject(isGuildMember, user);

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
		const actionsOnInfo: boolean = (await databaseManager.getConfig(<Snowflake>context.guild?.id)).actionsOnInfo;

		if (!actionsOnInfo) components = [];
		else if (!isGuildMember) components = [];
		else if (!args[0]) components = [];
		else if (user!.id === context.author.id) components = [];
		else components = [row];

		let description: string = "";

		if (user !== undefined && user) {
			if (user.flags !== null) description += this.client.bulbutils.badges(user.flags.bitfield) + "\n";
			description += await this.client.bulbutils.translate("userinfo_embed_id", context.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", context.guild?.id, { user });
			if (user.nickname !== null && user.nickname) description += await this.client.bulbutils.translate("userinfo_embed_nickname", context.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", context.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", context.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", context.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_created", context.guild?.id, { user_age: Math.floor(user.createdTimestamp / 1000) });

			if (user.premiumSinceTimestamp !== undefined && user.premiumSinceTimestamp && user.premiumSinceTimestamp > 0)
				description += await this.client.bulbutils.translate("userinfo_embed_premium", context.guild?.id, {
					user_premium: Math.floor(user.premiumSinceTimestamp / 1000),
				});

			if (user.joinedTimestamp !== undefined && user.joinedTimestamp)
				description += await this.client.bulbutils.translate("userinfo_embed_joined", context.guild?.id, { user_joined: Math.floor(user.joinedTimestamp / 1000) });

			if (user.roles !== undefined && user.roles)
				description += await this.client.bulbutils.translate("userinfo_embed_roles", context.guild?.id, {
					user_roles: user.roles.cache.map((r: any) => `${r}`).join(" "),
				});

			if (user.bot) {
				let data;
				try {
					data = await axios.get(`${discordApi}/applications/${target}/rpc`, {});
					data = data.data;
				} catch (error) {
					data = false;
				}

				if (data) {
					description += await this.client.bulbutils.translate("userinfo_embed_bot_info", context.guild?.id, {});
					if (data.summary !== "") description += `\n> ${data.summary.split("\n").join(" ")}`;
					if (data.tags) description += await this.client.bulbutils.translate("userinfo_embed_bot_tags", context.guild?.id, { tags: data.tags.map((t: any) => `\`${t}\``).join(" ") });

					description += await this.client.bulbutils.translate("userinfo_embed_bot_public", context.guild?.id, { emoji: data.bot_public ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF });
					description += await this.client.bulbutils.translate("userinfo_embed_bot_requires_code", context.guild?.id, {
						emoji: data.bot_require_code_grant ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
					});
					const botflags = this.client.bulbutils.applicationFlags(data.flags);

					description += await this.client.bulbutils.translate("userinfo_embed_bot_presence_intent", context.guild?.id, {
						emoji: botflags.includes("GATEWAY_PRESENCE") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
					});
					description += await this.client.bulbutils.translate("userinfo_embed_server_memebers_intent", context.guild?.id, {
						emoji: botflags.includes("GATEWAY_GUILD_MEMBERS") ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
					});
					description += await this.client.bulbutils.translate("userinfo_embed_bot_message_content_intent", context.guild?.id, {
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

			const infs = await infractionsManager.getOffenderInfractions(<string>context.guild?.id, user.id);
			if (infs) {
				let inf_emoji;

				if (infs.length <= 1) inf_emoji = Emotes.status.ONLINE;
				else if (infs.length === 2) inf_emoji = Emotes.other.INF1;
				else inf_emoji = Emotes.other.INF2;

				description += await this.client.bulbutils.translate("userinfo_embed_infractions", context.guild?.id, { emote_inf: inf_emoji, user_infractions: infs.length });
			}

			let color;
			if (user.roles === undefined || user.roles?.highest.name === "@everyone") color = embedColor;
			else color = user.roles?.highest.hexColor;

			const embed: MessageEmbed = new MessageEmbed()
				.setColor(color)
				.setThumbnail(user.avatarUrl)
				.setAuthor({
					name: `${user.username}#${user.discriminator}`,
					iconURL: user.avatarUrl,
				})
				.setDescription(description)
				.setFooter({
					text: await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
						user: context.author,
					}),
					iconURL: <string>context.author.avatarURL({ dynamic: true }),
				})
				.setTimestamp();

			const msg = await context.channel.send({ embeds: [embed], components });

			const filter = (i: any) => !i.bot;
			const collector = msg.createMessageComponentCollector({ filter, time: 30000 });

			collector.on("collect", async (interaction: ButtonInteraction): Promise<void> => {
				if (interaction.user.id !== context.author.id)
					return void (await interaction.reply({
						content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guildId!, {}),
						ephemeral: true,
					}));

				const command = Command.resolve(this.client, interaction.customId);
				if (!command)
					return void (await interaction.reply({
						content: await this.client.bulbutils.translate("global_error.unknown", context.guildId!, {}),
						ephemeral: true,
					}));

				const reason = await command.validate(await getCommandContext(interaction), [user.id, ""]);
				if (reason !== undefined) {
					if (reason) await interaction.reply({ content: reason, ephemeral: true });
					return;
				}

				msg.edit({ components: [rowDisabled] });
				await interaction.reply({
					content: await this.client.bulbutils.translate("userinfo_interaction_confirm", context.guild?.id, {
						action: await this.client.bulbutils.translate(`mod_action_types.${<ButtonActionType>interaction.customId}`, context.guild?.id, {}),
						target: user,
					}),
				});

				const filter = m => m.content && m.author.id === context.author.id;
				const collector = interaction.channel?.createMessageCollector({ filter, time: 15000, max: 1 });

				collector?.on("collect", async m => {
					let cArgs: string[] = [user.id, ...m.content.split(/ +/g)];
					await command.run(context, cArgs);
					await m.delete();
				});

				collector?.on("end", async () => {
					await interaction.deleteReply();
				});
			});

			collector.on("end", async () => {
				if (!actionsOnInfo) return;
				else if (!isGuildMember) return;
				else if (!args[0]) return;
				else if (user.id === context.author.id) return;
				msg.edit({ components: [rowDisabled] });
			});
		}
	}
}

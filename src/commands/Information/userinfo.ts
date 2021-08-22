import Command from "../../structures/Command";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import * as Emotes from "../../emotes.json";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();

// @ts-nocheck
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a user",
			category: "Information",
			aliases: ["whois", "info", "user"],
			usage: "[user]",
			examples: ["userinfo", "userinfo 190160914765316096", "userinfo @mrphilip#0001"],
			clearance: 50,
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		await message.guild?.members.fetch();
		let target: string;
		if (args[0] === undefined) target = message.author.id;
		else target = args[0].replace(NonDigits, "");

		let user: any = await message.guild?.members.cache.get(target);
		let isGuildMember = true;

		if (!user) {
			try {
				user = await this.client.users.fetch(target);
				isGuildMember = false;
			} catch (error) {
				await message.channel.send({
					content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
						arg_expected: "user:User",
						arg_provided: args[0],
						usage: this.usage,
					}),
					allowedMentions: {
						parse: ["everyone", "roles", "users"],
					},
				});
				return;
			}
		}

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

		let components;

		if ((await databaseManager.getConfig(<Snowflake>message.guild?.id)).actionsOnInfo !== true) components = [];
		else if (!isGuildMember) components = [];
		else if (!args[0]) components = [];
		else components = [row];

		let description: string = "";

		if (user !== undefined && user) {
			if (user.flags !== null) description += this.client.bulbutils.badges(user.flags.bitfield) + "\n";
			description += await this.client.bulbutils.translate("userinfo_embed_id", message.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_username", message.guild?.id, { user });
			if (user.nickname !== null && user.nickname) description += await this.client.bulbutils.translate("userinfo_embed_nickname", message.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", message.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", message.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", message.guild?.id, { user });
			description += await this.client.bulbutils.translate("userinfo_embed_created", message.guild?.id, { user_age: Math.floor(user.createdTimestamp / 1000) });

			if (user.premiumSinceTimestamp !== undefined && user.premiumSinceTimestamp && user.premiumSinceTimestamp > 0)
				description += await this.client.bulbutils.translate("userinfo_embed_premium", message.guild?.id, {
					user_premium: Math.floor(user.premiumSinceTimestamp / 1000),
				});

			if (user.joinedTimestamp !== undefined && user.joinedTimestamp)
				description += await this.client.bulbutils.translate("userinfo_embed_joined", message.guild?.id, { user_joined: Math.floor(user.joinedTimestamp / 1000) });

			if (user.roles !== undefined && user.roles)
				description += await this.client.bulbutils.translate("userinfo_embed_roles", message.guild?.id, {
					user_roles: user.roles.cache.map(r => `${r}`).join(", "),
				});

			const infs = await infractionsManager.getOffenderInfractions(<string>message.guild?.id, user.id);
			if (infs) {
				let inf_emoji;

				if (infs.length <= 1) inf_emoji = Emotes.status.ONLINE;
				else if (infs.length === 2) inf_emoji = Emotes.other.INF1;
				else inf_emoji = Emotes.other.INF2;

				description += await this.client.bulbutils.translate("userinfo_embed_infractions", message.guild?.id, { emote_inf: inf_emoji, user_infractions: infs.length });
			}

			let color;
			if (user.roles === undefined || user.roles?.highest.name === "@everyone") color = embedColor;
			else color = user.roles?.highest.hexColor;

			const embed: MessageEmbed = new MessageEmbed()
				.setColor(color)
				.setThumbnail(user.avatarUrl)
				.setAuthor(`${user.username}#${user.discriminator}`, user.avatarUrl)
				.setDescription(description)
				.setFooter(
					await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
						user: message.author,
					}),
					<string>message.author.avatarURL({ dynamic: true }),
				)
				.setTimestamp();

			const msg = await message.channel.send({ embeds: [embed], components });

			const filter = (i: any) => i.user.id === message.author.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

			collector.on("collect", async (interaction: ButtonInteraction) => {
				if (interaction.customId === "warn") {
					msg.edit({ components: [rowDisabled] });
					await interaction.reply({
						content: await this.client.bulbutils.translate("userinfo_interaction_confirm", message.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
							target: user,
						}),
					});

					const filter = m => m.content && m.author.id === message.author.id;
					const collector = interaction.channel?.createMessageCollector({ filter, time: 15000, max: 1 });

					collector?.on("collect", async m => {
						let cArgs: string[] = [user.id, ...m.content.split(/ +/g)];

						const command = Command.resolve(this.client, "warn")!;
						const reason = await command.validate(message, cArgs);
						if (reason !== undefined) {
							if (reason) {
								await message.channel.send(reason);
							}
						} else {
							await command.run(message, cArgs);
						}
						await m.delete();
					});

					collector?.on("end", async () => {
						await interaction.deleteReply();
					});
				}

				if (interaction.customId === "kick") {
					msg.edit({ components: [rowDisabled] });
					await interaction.reply({
						content: await this.client.bulbutils.translate("userinfo_interaction_confirm", message.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.kick", message.guild?.id, {}),
							target: user,
						}),
					});

					const filter = m => m.content && m.author.id === message.author.id;
					const collector = interaction.channel?.createMessageCollector({ filter, time: 15000, max: 1 });

					collector?.on("collect", async m => {
						let cArgs: string[] = [user.id, ...m.content.split(/ +/g)];

						const command = Command.resolve(this.client, "kick")!;
						const reason = await command.validate(message, cArgs);
						if (reason !== undefined) {
							if (reason) {
								await message.channel.send(reason);
							}
						} else {
							await command.run(message, cArgs);
						}
						await m.delete();
					});

					collector?.on("end", async () => {
						await interaction.deleteReply();
					});
				}

				if (interaction.customId === "ban") {
					msg.edit({ components: [rowDisabled] });
					await interaction.reply({
						content: await this.client.bulbutils.translate("userinfo_interaction_confirm", message.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
							target: user,
						}),
					});

					const filter = m => m.content && m.author.id === message.author.id;
					const collector = interaction.channel?.createMessageCollector({ filter, time: 15000, max: 1 });

					collector?.on("collect", async m => {
						let cArgs: string[] = [user.id, ...m.content.split(/ +/g)];

						const command = Command.resolve(this.client, "ban")!;
						const reason = await command.validate(message, cArgs);
						if (reason !== undefined) {
							if (reason) {
								await message.channel.send(reason);
							}
						} else {
							await command.run(message, cArgs);
						}
						await m.delete();
					});

					collector?.on("end", async () => {
						await interaction.deleteReply();
					});
				}
			});
		}
	}
}

import Event from "../../structures/Event";
import { Guild, GuildMember, Interaction, Message, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import { NonDigits, ReasonImage } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { Infraction } from "../../utils/types/Infraction";
import moment from "moment";
import * as Emotes from "../../emotes.json";
import { embedColor } from "../../Config";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import { BanType } from "../../utils/types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run(interaction: Interaction) {
		if (interaction.isSelectMenu()) {
			if (interaction.customId !== "infraction") return;
			const infID = Number(interaction.values[0].replace(NonDigits, ""));
			const inf: Infraction = <Infraction>await infractionsManager.getInfraction(<Snowflake>interaction.guild?.id, infID);

			const user = await this.client.bulbutils.userObject(false, await this.client.users.fetch(inf.targetId));
			const target: Record<string, string> = { tag: inf.target, id: inf.targetId };
			const moderator: Record<string, string> = { tag: inf.moderator, id: inf.moderatorId };

			let description: string = "";
			description += await this.client.bulbutils.translate("infraction_info_inf_id", interaction.guild?.id, { infraction_id: inf.id });
			description += await this.client.bulbutils.translate("infraction_info_target", interaction.guild?.id, { target });
			description += await this.client.bulbutils.translate("infraction_info_moderator", interaction.guild?.id, { moderator });
			description += await this.client.bulbutils.translate("infraction_info_created", interaction.guild?.id, {
				created: moment(Date.parse(inf.createdAt)).format("MMM Do YYYY, h:mm:ss a"),
			});

			if (inf.active !== "false" && inf.active !== "true") {
				description += await this.client.bulbutils.translate("infraction_info_expires", interaction.guild?.id, {
					expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.active)).format("MMM Do YYYY, h:mm:ss a")}`,
				});
			} else {
				description += await this.client.bulbutils.translate("infraction_info_active", interaction.guild?.id, {
					active: this.client.bulbutils.prettify(inf.active),
				});
			}

			description += await this.client.bulbutils.translate("infraction_info_reason", interaction.guild?.id, { reason: inf.reason });

			const image = inf.reason.match(ReasonImage);

			const embed: MessageEmbed = new MessageEmbed()
				.setTitle(this.client.bulbutils.prettify(inf.action))
				.setDescription(description)
				.setColor(embedColor)
				.setImage(<string>(image ? image[0] : null))
				.setThumbnail(user.avatarUrl)
				.setFooter(await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, { user: interaction.user }), <string>interaction.user.avatarURL({ dynamic: true }))
				.setTimestamp();

			await interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (interaction.isContextMenu()) {
			if ((await clearanceManager.getUserClearanceFromInteraction(interaction)) < 50)
				return await interaction.reply({ content: await this.client.bulbutils.translate("global_missing_permissions", interaction.guild?.id, {}), ephemeral: true });

			const message: Message = <Message>(
				await (<TextChannel>this.client.guilds.cache.get(<Snowflake>interaction.guild?.id)?.channels.cache.get(interaction.channelId)).messages.fetch(interaction.targetId)
			);

			if (
				await this.client.bulbutils.resolveUserHandleFromInteraction(
					interaction,
					await this.client.bulbutils.checkUserFromInteraction(interaction, <GuildMember>await interaction.guild?.members.fetch(message.author.id)),
					message.author,
				)
			)
				return;

			//Context commands
			if (interaction.commandName === "Ban") {
				const infID = await infractionsManager.ban(
					this.client,
					<Guild>interaction.guild,
					BanType.CLEAN,
					message.author,
					<GuildMember>interaction.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
						moderator: interaction.user,
						target: message.author,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
					}),
					await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
				);

				await interaction.reply({
					content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
						target: message.author,
						moderator: interaction.user,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
						infraction_id: infID,
					}),
					ephemeral: true,
				});
			} else if (interaction.commandName === "Kick") {
				const infID = await infractionsManager.kick(
					this.client,
					<Snowflake>interaction.guild?.id,
					<GuildMember>await interaction.guild?.members.fetch(message.author.id),
					<GuildMember>interaction.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.kick", message.guild?.id, {}),
						moderator: interaction.user,
						target: message.author,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
					}),
					await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
				);

				await interaction.reply({
					content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.kick", interaction.guild?.id, {}),
						target: message.author,
						moderator: interaction.user,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
						infraction_id: infID,
					}),
					ephemeral: true,
				});
			} else if (interaction.commandName === "Warn") {
				const infID = await infractionsManager.warn(
					this.client,
					<Snowflake>interaction.guild?.id,
					<GuildMember>await interaction.guild?.members.fetch(message.author.id),
					<GuildMember>interaction.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
						moderator: interaction.user,
						target: message.author,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
					}),
					await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
				);

				await interaction.reply({
					content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
						target: message.author,
						moderator: interaction.user,
						reason: await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
						infraction_id: infID,
					}),
					ephemeral: true,
				});
			}
		}
	}
}

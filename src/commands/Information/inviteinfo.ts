import { CommandInteraction, Invite, MessageEmbed, Widget } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";

export default class InviteInfo extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.ChatInput,
			description: "Returns information about the characters provided",
			options: [
				{
					name: "invite",
					type: ApplicationCommandOptionType.String,
					description: "The invite you want to resolve",
					required: true,
				},
			],
			command_permissions: ["MANAGE_GUILD"],
		});
	}

	public async run(interaction: CommandInteraction) {
		const code: string = interaction.options.getString("invite") as string;
		let invite: Invite;

		try {
			invite = await this.client.fetchInvite(code);
		} catch (error) {
			await interaction.reply({
				content: await this.client.bulbutils.translate("inviteinfo_error", interaction.guild?.id, {}),
				ephemeral: true,
			});
			return;
		}

		if (invite.channel.type === "GROUP_DM")
			await interaction.reply({
				content: await this.client.bulbutils.translate("inviteinfo_groupdm", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const guild = invite.guild;
		if (guild === null || interaction.guild?.id === null || interaction.member === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.inviteinfo_guild_or_member_null", interaction.guild?.id, {}),
				ephemeral: true,
			});

		let desc = "";
		let inviteInfo = "";

		desc += `${this.client.bulbutils.guildFeatures(guild.features)}\n\n`;
		desc += await this.client.bulbutils.translate("inviteinfo_verification_level", interaction.guild?.id, { guild });

		inviteInfo += await this.client.bulbutils.translate("inviteinfo_code", interaction.guild?.id, { invite });
		inviteInfo += `${Emotes.status.ONLINE}: \`${invite.presenceCount}\`\n`;
		inviteInfo += `${Emotes.status.OFFLINE}: \`${invite.memberCount}\`\n\n`;

		if (invite.inviter) {
			let inviter = "";

			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_id", interaction.guild?.id, { invite });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_tag", interaction.guild?.id, { invite });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_avatar", interaction.guild?.id, {
				user_avatar: invite.inviter.avatarURL({ dynamic: true, size: 4096 }),
			});

			desc += "\n**Inviter**\n" + inviter;
		}

		if (invite.channel) {
			let inviteChannel = "";

			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_id", interaction.guild?.id, { invite });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_name", interaction.guild?.id, { invite });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_nsfw", interaction.guild?.id, { invite });

			desc += "\n**Invite Channel**\n" + inviteChannel;
		}

		const embeds: MessageEmbed[] = [];
		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle(guild.description || "")
			.setAuthor({
				name: `${guild.name} (${guild.id})`,
				iconURL: guild.iconURL({ dynamic: true }) ?? undefined,
			})
			.setDescription(desc)
			.addField("**Invite**", inviteInfo, true)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }) || "")
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) as string,
			})
			.setTimestamp();

		embeds.push(embed);

		let widget: Widget | null;
		try {
			widget = await this.client.fetchGuildWidget(guild.id);
		} catch (error) {
			widget = null;
		}

		if (widget) {
			const widgetEmbed = new MessageEmbed()
				.setColor(embedColor)
				.setTitle("Widget Data")
				.setFooter({
					text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
						user: interaction.user,
					}),
					iconURL: interaction.user.avatarURL({ dynamic: true }) as string,
				})
				.setTimestamp()
				.setDescription(`**Member (${widget.members.size})**\n${widget.members.map((m) => `\`${m.username}\``).join(" ")}`);

			embeds.push(widgetEmbed);
		}

		return interaction.reply({ embeds });
	}
}

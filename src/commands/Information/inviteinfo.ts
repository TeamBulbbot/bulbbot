import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Invite, MessageEmbed, Widget } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a server from the invite link",
			category: "Information",
			aliases: ["inv"],
			usage: "<invitecode>",
			examples: ["inviteinfo cacUmbQ", "inviteinfo https://discord.gg/cacUmbQ"],
			argList: ["invitecode:String"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		const code: string = args[0];
		let invite!: Invite;

		try {
			invite = await this.client.fetchInvite(code);
		} catch (error) {
			await context.channel.send(await this.client.bulbutils.translate("inviteinfo_error", context.guild!.id, {}));
			return;
		}

		if (invite.channel.type === "GROUP_DM") {
			context.channel.send(await this.client.bulbutils.translate("inviteinfo_groupdm", context.guild!.id, {}));
			return;
		}

		const guild = invite!.guild;
		if (guild === null || context.guild === null || context.member === null) return;

		let desc: string = "";
		let inviteInfo: string = "";

		desc += `${this.client.bulbutils.guildFeatures(guild.features)}\n\n`;
		desc += await this.client.bulbutils.translate("inviteinfo_verification_level", context.guild.id, { guild });

		inviteInfo += await this.client.bulbutils.translate("inviteinfo_code", context.guild.id, { invite });
		inviteInfo += `${Emotes.status.ONLINE}: \`${invite.presenceCount}\`\n`;
		inviteInfo += `${Emotes.status.OFFLINE}: \`${invite.memberCount}\`\n\n`;

		if (invite.inviter) {
			let inviter = "";

			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_id", context.guild.id, { invite });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_tag", context.guild.id, { invite });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_avatar", context.guild.id, { user_avatar: invite.inviter.avatarURL({ dynamic: true, size: 4096 }) });

			desc += "\n**Inviter**\n" + inviter;
		}

		if (invite.channel) {
			let inviteChannel = "";

			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_id", context.guild.id, { invite });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_name", context.guild.id, { invite });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_nsfw", context.guild.id, { invite });

			desc += "\n**Invite Channel**\n" + inviteChannel;
		}

		const embeds: MessageEmbed[] = [];
		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle(guild.description !== null ? `${guild.description}` : "")
			.setAuthor({
				name: `${guild.name} (${guild.id})`,
				iconURL: guild.iconURL({ dynamic: true }) ?? undefined,
			})
			.setDescription(desc)
			.addField("**Invite**", inviteInfo, true)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })!)
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, {
					user: context.author,
				}),
				iconURL: await this.client.bulbutils.userObject(true, context.member).avatarUrl,
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
					text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, {
						user: context.author,
					}),
					iconURL: await this.client.bulbutils.userObject(true, context.member).avatarUrl,
				})
				.setTimestamp()
				.setDescription(`**Member (${widget.members.size})**\n${widget.members.map(m => `\`${m.username}\``).join(" ")}`);

			embeds.push(widgetEmbed);
		}

		await context.channel.send({ embeds });
	}
}

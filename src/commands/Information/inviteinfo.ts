import Command from "../../structures/Command";
import { Invite, Message, MessageEmbed, TextChannel } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns some useful info about a guild from the invite link",
			category: "Information",
			aliases: ["inv"],
			usage: "!inviteinfo <invitecode>",
			examples: ["inviteinfo cacUmbQ", "inviteinfo https://discord.gg/cacUmbQ"],
			argList: ["invitecode:string"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		const code: string = args[0];
		let invite!: Invite;

		try {
			invite = await this.client.fetchInvite(code);
		} catch (error) {
			message.channel.send(await this.client.bulbutils.translate("inviteinfo_error", message.guild!.id));
			return;
		}

		const guild = invite!.guild;
		if (guild === null || message.guild === null || message.member === null) return;

		let desc: string = "";
		let inviteInfo: string = "";

		desc += `${this.client.bulbutils.guildFeatures(guild.features)}\n\n`;
		desc += await this.client.bulbutils.translate("inviteinfo_verification_level", guild.id, { verification_level: guild.verificationLevel });
		desc += await this.client.bulbutils.translate("inviteinfo_large", guild.id, { large: guild.large });

		inviteInfo += await this.client.bulbutils.translate("inviteinfo_code", guild.id, { code: invite.code });
		inviteInfo += `${Emotes.status.ONLINE}: \`${invite.presenceCount}\`\n`;
		inviteInfo += `${Emotes.status.OFFLINE}: \`${invite.memberCount}\`\n\n`;

		if (invite.inviter) {
			let inviter = "";

			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_id", guild.id, { user_id: invite.inviter.id });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_tag", guild.id, { user_tag: invite.inviter.tag });
			inviter += await this.client.bulbutils.translate("inviteinfo_inviter_avatar", guild.id, { user_avatar: invite.inviter.avatarURL({ dynamic: true, size: 4096 }) });

			desc += "\n**Inviter**\n" + inviter;
		}
		if (invite.channel) {
			let inviteChannel = "";

			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_id", guild.id, { channel_id: invite.channel.id });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_name", guild.id, { channel_name: invite.channel.name });
			inviteChannel += await this.client.bulbutils.translate("inviteinfo_channel_nsfw", guild.id, { channel_nsfw: (<TextChannel>invite.channel).nsfw });

			desc += "\n**Invite Channel**\n" + inviteChannel;
		}

		let embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle(guild.description !== null ? `${guild.description}` : "")
			.setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ dynamic: true })!)
			.setDescription(desc)
			.addField("**Invite**", inviteInfo, true)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })!)
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		message.channel.send(embed);
	}
}

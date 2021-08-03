import Command from "../../structures/Command";
import { Invite, Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns some useful info about a guild from the invite link",
			category: "Information",
			aliases: ["inv"],
			usage: "inviteinfo <invitecode>",
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
			await message.channel.send(await this.client.bulbutils.translateNew("inviteinfo_error", message.guild!.id, {}));
			return;
		}

		const guild = invite!.guild;
		if (guild === null || message.guild === null || message.member === null) return;

		let desc: string = "";
		let inviteInfo: string = "";

		desc += `${this.client.bulbutils.guildFeatures(guild.features)}\n\n`;
		desc += await this.client.bulbutils.translateNew("inviteinfo_verification_level", guild.id, { guild });
		desc += await this.client.bulbutils.translateNew("inviteinfo_large", guild.id, { guild });

		inviteInfo += await this.client.bulbutils.translateNew("inviteinfo_code", guild.id, { invite });
		inviteInfo += `${Emotes.status.ONLINE}: \`${invite.presenceCount}\`\n`;
		inviteInfo += `${Emotes.status.OFFLINE}: \`${invite.memberCount}\`\n\n`;

		if (invite.inviter) {
			let inviter = "";

			inviter += await this.client.bulbutils.translateNew("inviteinfo_inviter_id", guild.id, { invite });
			inviter += await this.client.bulbutils.translateNew("inviteinfo_inviter_tag", guild.id, { invite });
			inviter += await this.client.bulbutils.translateNew("inviteinfo_inviter_avatar", guild.id, { user_avatar: invite.inviter.avatarURL({ dynamic: true, size: 4096 }) });

			desc += "\n**Inviter**\n" + inviter;
		}
		if (invite.channel) {
			let inviteChannel = "";

			inviteChannel += await this.client.bulbutils.translateNew("inviteinfo_channel_id", guild.id, { invite });
			inviteChannel += await this.client.bulbutils.translateNew("inviteinfo_channel_name", guild.id, { invite });
			inviteChannel += await this.client.bulbutils.translateNew("inviteinfo_channel_nsfw", guild.id, { invite });

			desc += "\n**Invite Channel**\n" + inviteChannel;
		}

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setTitle(guild.description !== null ? `${guild.description}` : "")
			.setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ dynamic: true })!)
			.setDescription(desc)
			.addField("**Invite**", inviteInfo, true)
			.setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })!)
			.setImage(guild.splash !== null ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096` : "")
			.setFooter(
				await this.client.bulbutils.translateNew("global_executed_by", message.guild.id, {
					user: message.author,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

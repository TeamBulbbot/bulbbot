const Discord = require("discord.js");
const Command = require("../../structures/Command");
const Emotes = require("../../emotes.json");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns some useful info about a guild from the invite link",
			category: "Information",
			aliases: ["inv"],
			usage: "!inviteinfo <invitecode>",
			argList: ["invitecode:string"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		const code = args[0];
		let invite;
		try {
			invite = await this.client.fetchInvite(code);
		} catch (error) {
			return message.channel.send(this.client.bulbutils.translate("inviteinfo_error"));
		}

		const guild = invite.guild;
		let desc = "";
		let inviteInfo = "";

		desc += `${this.client.bulbutils.guildFeatures(guild.features)}\n\n`;
		desc += `Verification Level: \`${guild.verificationLevel}\`\n`;
		desc += `Large: \`${guild.large}\`\n\n`;

		inviteInfo += `Code: \`${invite.code}\`\n`;
		inviteInfo += `${Emotes.status.ONLINE}: \`${invite.presenceCount}\`\n`;
		inviteInfo += `${Emotes.status.OFFLINE}: \`${invite.memberCount}\`\n\n`;

		let embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setTitle(guild.description !== null ? `${guild.description}` : "")
			.setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ dynamic: true }))
			.setDescription(desc)
			.addField("**Invite**", inviteInfo, true)
			.setImage(
				guild.splash !== null
					? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096`
					: guild.iconURL({ dynamic: true, size: 4096 }),
			)
			.setFooter(
				this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		if (invite.inviter) {
			let inviter = "";
			inviter += `Id: \`${invite.inviter.id}\`\n`;
			inviter += `User: \`${invite.inviter.tag}\`\n`;
			inviter += `Avatar: [\`Link (4096)\`](${invite.inviter.avatarURL({ dynamic: true, size: 4096 })})\n\n`;

			embed.addField("**Inviter**", inviter, true);
		}
		if (invite.channel) {
			let inviteChannel = "";
			inviteChannel += `Id: \`${invite.channel.id}\`\n`;
			inviteChannel += `Name: \`#${invite.channel.name}\`\n`;
			inviteChannel += `NSFW: \`${invite.channel.nsfw}\`\n`;

			embed.addField("**Invite Channel**", inviteChannel, true);
		}

		return message.channel.send(embed);
	}
};

import Command from "../../structures/Command";
import {Message, MessageEmbed} from "discord.js";
import * as Config from "../../structures/Config";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns the invite link for the bot and the support guild",
			category: "Bot",
			aliases: ["support"],
			usage: "!invite",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const botInvite: string = `https://discord.com/oauth2/authorize?client_id=${Config.id}&scope=bot&permissions=1573252311`;

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("invite_desc", message.guild?.id, {
					bot_invite: botInvite,
					support_guild: Config.supportInvite,
				}),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				<string>message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

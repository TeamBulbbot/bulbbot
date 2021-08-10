import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns the invite link for the bot and the support guild",
			category: "Bot",
			aliases: ["support"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("invite_desc", message.guild?.id, {
					bot_invite: Config.botInvite,
					support_guild: Config.supportInvite,
				}),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user: message.author,
				}),
				<string>message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

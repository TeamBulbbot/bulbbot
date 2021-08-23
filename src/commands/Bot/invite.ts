import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed } from "discord.js";
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

	async run(context: CommandContext): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("invite_desc", context.guild?.id, {
					bot_invite: Config.botInvite,
					support_guild: Config.supportInvite,
				}),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}

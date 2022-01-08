import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Return a list of all available commands to Bulbbot",
			category: "Bot",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(await this.client.bulbutils.translate("commands_help", context.guild?.id, {}))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				iconURL: <string>context.author.avatarURL({ dynamic: true }),
			})
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}

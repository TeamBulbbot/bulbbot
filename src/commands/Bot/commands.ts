import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";

export default class extends Command {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			description: "Return a list of all available commands to Bulbbot",
			category: "Bot",
			usage: "!commands",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(await this.client.bulbutils.translateNew("commands_help", message.guild?.id, {}))
			.setFooter(
				await this.client.bulbutils.translateNew("global_executed_by", message.guild?.id, {
					user: message.author,
				}),
				<string>message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Return a link to the github repository",
			category: "Bot",
			aliases: ["code", "sourcecode"],
			usage: "!github",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(await this.client.bulbutils.translate("github_source_code", message.guild?.id, {}))
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

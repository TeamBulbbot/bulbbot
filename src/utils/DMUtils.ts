import BulbBotClient from "../structures/BulbBotClient";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { botDM, embedColor } from "../Config";

export default async function (client: BulbBotClient, message: Message) {
	const channel: TextChannel | undefined = <TextChannel | undefined>client.channels.cache.get(botDM);
	if (!channel) return;

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor(`${message.author.tag} (${message.author.id})`, <string>message.author.avatarURL({ dynamic: true }))
		.setDescription(message.content)
		.setFooter(`ID: ${message.channel.id}-${message.id}`)
		.setImage(message.attachments.first()?.proxyURL ?? "")
		.setTimestamp();

	await channel.send(embed);
}

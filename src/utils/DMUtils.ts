import BulbBotClient from "../structures/BulbBotClient";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { botDM, embedColor } from "../Config";

export default async function (client: BulbBotClient, message: Message) {
	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor(`${message.author.tag} (${message.author.id})`, <string>message.author.avatarURL({ dynamic: true }))
		.setDescription(message.content)
		.setFooter(`ID: ${message.channel.id}-${message.id}`)
		// @ts-ignore
		.setImage(message.attachments.first() !== undefined ? message.attachments.first().proxyURL : "")
		.setTimestamp();

	const channel: TextChannel = <TextChannel>client.channels.cache.get(botDM);
	await channel.send(embed);
}

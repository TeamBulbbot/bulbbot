import BulbBotClient from "../structures/BulbBotClient";
import { MessageEmbed, TextChannel } from "discord.js";
import { botDM, embedColor } from "../Config";
import CommandContext from "src/structures/CommandContext";

export default async function (client: BulbBotClient, context: CommandContext) {
	const channel: TextChannel | undefined = <TextChannel | undefined>client.channels.cache.get(botDM);
	if (!channel) return;
	if (context.author.id === client.user?.id) return;

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor(`${context.author.tag} (${context.author.id})`, <string>context.author.avatarURL({ dynamic: true }))
		.setDescription(context.content)
		.setFooter(`ID: ${context.channel.id}-${context.id}`)
		.setImage(context.attachments.first()?.proxyURL ?? "")
		.setTimestamp();

	await channel.send({ embeds: [embed] });
}

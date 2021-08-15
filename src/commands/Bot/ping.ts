import Command from "../../structures/Command";
import * as Config from "../../Config";
import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Return the Websocket and API latency",
			category: "Bot",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const latency: number = Math.floor(Date.now() - message.createdTimestamp);
		const apiLatency: number = Math.round(this.client.ws.ping);

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(<ColorResolvable>Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("ping_latency", message.guild?.id, {
					latency_bot: latency,
					latency_ws: apiLatency,
				}),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user: message.author,
				}),
				<string>message.author.avatarURL(),
			)
			.setTimestamp();

		await message.channel.send({ embeds: [embed] });
	}
}

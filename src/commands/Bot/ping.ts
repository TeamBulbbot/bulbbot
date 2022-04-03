import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import * as Config from "../../Config";
import { Message, MessageEmbed } from "discord.js";
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

	async run(context: CommandContext): Promise<void> {
		const pong: Message = await context.channel.send("Pong!");
		const latency: number = Math.floor(pong.createdTimestamp - context.createdTimestamp);
		const apiLatency: number = Math.round(this.client.ws.ping);

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("ping_latency", context.guild?.id, {
					latency_bot: latency,
					latency_ws: apiLatency,
				}),
			)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				iconURL: context.author.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await pong.edit({ embeds: [embed] });
	}
}

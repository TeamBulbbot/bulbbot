import Command from "../../structures/Command";
import * as Config from "../../Config";
import { ColorResolvable, Message, MessageEmbed } from "discord.js";

export default class extends Command {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			description: "Return the Websocket and API latency",
			category: "Bot",
			usage: "!ping",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		const latency: number = Math.floor(new Date().getTime() - message.createdTimestamp);
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
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				<string>message.author.avatarURL(),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

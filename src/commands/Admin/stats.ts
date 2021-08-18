import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";
import axios from "axios";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some stats that is useful to the developers",
			category: "Admin",
			aliases: ["analytics"],
			subDevOnly: true,
		});
	}

	async run(message: Message): Promise<void> {
		if (message.guild === null || message.member === null) return;
		this.client.guilds.cache.map(g => g.members.fetch());

		const shardData: string[] = this.client.ws.shards.map(shard => `${selectEmoji(shard.ping)} Shard ID: ${shard.id} \`${shard.ping} ms\`\n`);
		const desc: string = `Guild Count: \`${numberWithCommas(this.client.guilds.cache.size)}\`\n Users: \`${numberWithCommas(
			this.client.guilds.cache.map(g => g.members.cache.filter(m => !m.user.bot).size).reduce((a, b) => a + b),
		)}\``;

		const gatewayBotRaw = await axios.get("https://discord.com/api/v9/gateway/bot", { headers: { authorization: `Bot ${process.env.TOKEN}` } });
		const lolNotPrivateEnoughtDiscordJS = gatewayBotRaw.data.session_start_limit;

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setFooter(await this.client.bulbutils.translate("global_executed_by", message.guild.id, { user: message.author }), <string>message.author.avatarURL({ dynamic: true }))
			.setDescription(desc)
			.addField("Shard Data", `${shardData.join("")}`, true)
			.addField(
				"Session Limit",
				`Total: \`${lolNotPrivateEnoughtDiscordJS.total}\`\nRemaining: \`${lolNotPrivateEnoughtDiscordJS.remaining}\`\nReset @: <t:${Math.floor(
					Math.floor(Date.now() / 1000) + lolNotPrivateEnoughtDiscordJS.reset_after / 1000,
				)}>`,
				true,
			)
			.setTimestamp();

		await message.channel.send({ embeds: [embed] });
	}
}

function numberWithCommas(x: any): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectEmoji(ping: number): string {
	let emoji: string = "";
	if (ping >= 0 && ping <= 150) emoji = Emotes.other.GOOD;
	else if (ping > 150 && ping <= 300) emoji = Emotes.other.MEDIUM;
	else emoji = Emotes.other.BAD;

	return emoji;
}

import Command from "../../structures/Command";
import { Message, MessageEmbed, Util } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";

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

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setFooter(await this.client.bulbutils.translate("global_executed_by", message.guild.id, { user: message.author }), <string>message.author.avatarURL({ dynamic: true }))
			.setDescription(desc)
			.addField("Shard Data", `Recommended Shards: \`${await Util.fetchRecommendedShards(this.client.token!, 500)}\`\n${shardData.join("")}`, true)
			.addField(
				"Session Limit", // @ts-ignore
				`Total: \`${this.client.ws.sessionStartLimit?.total}\`\nRemaining: \`${this.client.ws.sessionStartLimit?.remaining}\`\nReset @: <t:${Math.floor(
					// @ts-ignore
					Math.floor(Date.now() / 1000) + this.client.ws.sessionStartLimit?.reset_after / 1000,
				)}>`,
				true,
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

function numberWithCommas(x: any): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectEmoji(ping: number): string {
	let emoji: string = "";
	if (ping >= 0 && ping <= 150) emoji = Emotes.other.Good;
	else if (ping > 150 && ping <= 300) emoji = Emotes.other.Medium;
	else emoji = Emotes.other.Bad;

	return emoji;
}

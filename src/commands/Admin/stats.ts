import { CommandInteraction, MessageEmbed } from "discord.js";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v9";
import { discordApi, embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";
import axios from "axios";
import prisma from "../../prisma";

export default class Stats extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some stats that is useful to the developers",
			type: ApplicationCommandType.ChatInput,
			devOnly: true,
		});
	}

	public async run(interaction: CommandInteraction) {
		const shardData: string[] = this.client.ws.shards.map((shard) => `${selectEmoji(shard.ping)} Shard ID: ${shard.id} \`${shard.ping} ms\`\n`);
		const { data } = await axios.get<any>(`${discordApi}/gateway/bot`, { headers: { authorization: `Bot ${process.env.TOKEN}` } });

		const amtMessages = await prisma.messageLog.count();
		const amtOfInfractions = await prisma.infraction.count();
		const querySize = await prisma.$queryRaw<{ pg_size_pretty: string }[]>`SELECT pg_size_pretty(pg_database_size('bulbbot'));`;

		const desc: string[] = [
			`Guild Count: \`${numberWithCommas(this.client.guilds.cache.size)}\``,
			`Users: \`${numberWithCommas(this.client.guilds.cache.reduce((a: any, g: { memberCount: any }) => a + g.memberCount, 0))}\``,
			`\n**Cache**`,
			`Users: \`${numberWithCommas(this.client.users.cache.size)}\``,
			`Channels: \`${numberWithCommas(this.client.channels.cache.size)}\``,
			`Emojis: \`${numberWithCommas(this.client.emojis.cache.size)}\``,
			`\n**PostreSQL Data**`,
			`Stored Messages: \`${numberWithCommas(amtMessages)}\``,
			`Stored Infractions: \`${numberWithCommas(amtOfInfractions)}\``,
			`Size of database: \`${querySize[0].pg_size_pretty}\``,
		];

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, { user: interaction.user }),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setDescription(desc.join("\n"))
			.addField("Shard Data", `Recommended number of shards: \`${data.shards}\`\n${shardData.join("")}`, true)
			.addField(
				"Session Limit",
				`Total: \`${data.session_start_limit.total}\`\nRemaining: \`${data.session_start_limit.remaining}\`\nMax Concurrency: \`${data.session_start_limit.max_concurrency}\`\nReset @: <t:${Math.floor(
					Math.floor(Date.now() / 1000) + data.session_start_limit.reset_after / 1000,
				)}>`,
				true,
			)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	}
}

function numberWithCommas(x: any): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectEmoji(ping: number): string {
	if (ping >= 0 && ping <= 150) return Emotes.other.GOOD;
	else if (ping > 150 && ping <= 300) return Emotes.other.MEDIUM;
	else return Emotes.other.BAD;
}

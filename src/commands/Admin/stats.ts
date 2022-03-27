import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";
import axios from "axios";
import { sequelize } from "../../utils/database/connection";
import { QueryTypes } from "sequelize";
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some stats that is useful to the developers",
			category: "Admin",
			aliases: ["analytics", "gateway"],
			subDevOnly: true,
		});
	}

	async run(context: CommandContext): Promise<void> {
		if (context.guild === null || context.member === null) return;
		//this.client.guilds.cache.map(g => g.members.fetch());

		const shardData: string[] = this.client.ws.shards.map(shard => `${selectEmoji(shard.ping)} Shard ID: ${shard.id} \`${shard.ping} ms\`\n`);
		const { data } = await axios.get<any>("https://discord.com/api/v9/gateway/bot", { headers: { authorization: `Bot ${process.env.TOKEN}` } });

		const amtMessages: any = await sequelize.query('SELECT COUNT(*) FROM "messageLogs"', {
			type: QueryTypes.SELECT,
		});
		const amtOfInfractions: any = await sequelize.query('SELECT COUNT(*) FROM "infractions"', {
			type: QueryTypes.SELECT,
		});
		const sizeOfDB: any = await sequelize.query("SELECT pg_size_pretty(pg_database_size('bulbbot'))", {
			type: QueryTypes.SELECT,
		});

		const postgresData = {
			amtMessages: amtMessages[0].count,
			amtInfractions: amtOfInfractions[0].count,
			databaseSize: sizeOfDB[0].pg_size_pretty,
		};

		const desc: string[] = [
			`Guild Count: \`${numberWithCommas(this.client.guilds.cache.size)}\``,
			`Users: \`${numberWithCommas(this.client.guilds.cache.reduce((a: any, g: { memberCount: any }) => a + g.memberCount, 0))}\``,
			`\n**Cache**`,
			`Users: \`${this.client.users.cache.size}\``,
			`Channels: \`${this.client.channels.cache.size}\``,
			`Emojis: \`${this.client.emojis.cache.size}\``,
			`\n**PostreSQL Data**`,
			`Stored Messages: \`${numberWithCommas(postgresData.amtMessages)}\``,
			`Stored Infractions: \`${numberWithCommas(postgresData.amtInfractions)}\``,
			`Size of database: \`${postgresData.databaseSize}\``,
		];

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, { user: context.author }),
				iconURL: <string>context.author.avatarURL({ dynamic: true }),
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

		await context.channel.send({ embeds: [embed] });
	}
}

function numberWithCommas(x: any): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectEmoji(ping: number): string {
	let emoji = "";
	if (ping >= 0 && ping <= 150) emoji = Emotes.other.GOOD;
	else if (ping > 150 && ping <= 300) emoji = Emotes.other.MEDIUM;
	else emoji = Emotes.other.BAD;

	return emoji;
}

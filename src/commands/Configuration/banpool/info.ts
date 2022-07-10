import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageEmbed } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import { embedColor } from "../../../Config";
import { BanpoolSubscriber } from "@prisma/client";

const { haveAccessToPool, getPoolData }: BanpoolManager = new BanpoolManager();
export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "info",
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool-name:String"],
			usage: "<pool-name>",
			clearance: 100,
			description: "Get information about a banpool.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const name: string = args[0];
		if (!(context.guild?.id && (await haveAccessToPool(context.guild.id, name))))
			return context.channel.send(
				await this.client.bulbutils.translate("banpool_missing_access_not_found", context.guild?.id, {
					pool: name,
				}),
			);
		const { banpoolSubscribers } = (await getPoolData(name)) || { banpoolSubscribers: [] as BanpoolSubscriber[] };
		const desc: string[] = [];

		for (let i = 0; i < banpoolSubscribers.length; i++) {
			const guild = banpoolSubscribers[i];
			desc.push(
				await this.client.bulbutils.translate("banpool_info_desc", context.guild.id, {
					guildId: guild.guildId,
					createdAt: new Date(guild.createdAt).getTime() / 1000,
				}),
			);
		}

		const embed: MessageEmbed = new MessageEmbed()
			.setAuthor({
				name: await this.client.bulbutils.translate("banpool_info_top", context.guild.id, {
					name,
					amountOfServers: banpoolSubscribers.length,
				}),
			})
			.setColor(embedColor)
			.setDescription(desc.join("\n\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, {
					user: context.author,
				}),
				iconURL: context.author.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}

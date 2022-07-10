import { CommandInteraction, MessageEmbed, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import { embedColor } from "../../../Config";
import { BanpoolSubscriber } from "@prisma/client";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import moment from "moment";

const { haveAccessToPool, getPoolData }: BanpoolManager = new BanpoolManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "info",
			description: "Get information about a banpool",
			options: [
				{
					name: "name",
					description: "The name of the banpool",
					type: ApplicationCommandOptionType.String,
					required: true,
					max_length: 255,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const name: string = interaction.options.getString("name") as string;

		if (!(await haveAccessToPool(interaction.guild?.id as Snowflake, name)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_access_not_found", interaction.guild?.id, {
					pool: name,
				}),
				ephemeral: true,
			});

		const { banpoolSubscribers } = (await getPoolData(name)) || { banpoolSubscribers: [] as BanpoolSubscriber[] };
		const desc: string[] = [];

		for (let i = 0; i < banpoolSubscribers.length; i++) {
			const guild = banpoolSubscribers[i];
			desc.push(
				await this.client.bulbutils.translate("banpool_info_desc", interaction.guild?.id, {
					guildId: guild.guildId,
					createdAt: moment(guild.createdAt).unix(),
				}),
			);
		}

		const embed: MessageEmbed = new MessageEmbed()
			.setAuthor({
				name: await this.client.bulbutils.translate("banpool_info_top", interaction.guild?.id, {
					name,
					amountOfServers: banpoolSubscribers.length,
				}),
			})
			.setColor(embedColor)
			.setDescription(desc.join("\n\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}
}

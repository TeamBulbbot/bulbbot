import { CommandInteraction, MessageEmbed, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import { embedColor } from "../../../Config";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import moment from "moment";

const { getPools }: BanpoolManager = new BanpoolManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "list",
			description: "List all banpools",
			options: [],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const data = await getPools(interaction.guild?.id as Snowflake);
		const desc: string[] = [];

		for (let i = 0; i < data.length; i++) {
			const pool = data[i];
			desc.push(
				await this.client.bulbutils.translate("banpool_list_desc", interaction.guild?.id, {
					name: pool.name,
					createdAt: moment(pool.createdAt).unix(),
				}),
			);
		}

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	}
}

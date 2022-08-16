import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, MessageEmbed, Snowflake } from "discord.js";
import { ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import moment from "moment";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class InfractionInfo extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "info",
			description: "Get info about an infraction",
			options: [
				{
					name: "id",
					type: ApplicationCommandOptionType.Integer,
					description: "The ID of the infraction",
					required: true,
					min_value: 1,
					max_value: 2147483647,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const infractionId: number = interaction.options.getInteger("id") as number;

		const inf = await infractionsManager.getInfraction(interaction.guild?.id as Snowflake, infractionId);
		if (!inf) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_not_found", interaction.guild?.id, {
					infraction_id: infractionId,
				}),
				ephemeral: true,
			});
		}

		const user = await this.client.bulbfetch.getUser(inf.targetId);
		const target = { tag: inf.target, id: inf.targetId };
		const moderator = { tag: inf.moderator, id: inf.moderatorId };

		let description = "";
		description += await this.client.bulbutils.translate("infraction_info_inf_id", interaction.guild?.id, { infraction_id: infractionId });
		description += await this.client.bulbutils.translate("infraction_info_target", interaction.guild?.id, { target });
		description += await this.client.bulbutils.translate("infraction_info_moderator", interaction.guild?.id, { moderator });
		description += await this.client.bulbutils.translate("infraction_info_created", interaction.guild?.id, {
			created: moment(inf.createdAt).format("MMM Do YYYY, h:mm:ss a"),
		});

		if (inf.timeout) {
			description += await this.client.bulbutils.translate("infraction_info_expires", interaction.guild?.id, {
				expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.timeout)).format("MMM Do YYYY, h:mm:ss a")}`,
			});
		}

		description += await this.client.bulbutils.translate("infraction_info_reason", interaction.guild?.id, { reason: inf.reason });
		description += await this.client.bulbutils.translate("infraction_info_active", interaction.guild?.id, { active: this.client.bulbutils.prettify(`${inf.active}`) });

		const image = inf.reason.match(ReasonImage);
		const embed: MessageEmbed = new MessageEmbed()
			.setTitle(this.client.bulbutils.prettify(inf.action))
			.setDescription(description)
			.setColor(embedColor)
			.setImage(image ? image[0] : "")
			.setThumbnail(user?.avatarURL({ dynamic: true }) || "")
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, { user: interaction.user }),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	}
}

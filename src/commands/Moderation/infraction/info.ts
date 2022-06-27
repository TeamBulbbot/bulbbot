import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageEmbed } from "discord.js";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import moment from "moment";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "info",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["id:Number"],
			usage: "<id>",
			description: "Get information about an infraction.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		if (!context.guild) return;
		const infID = Number(args[0].replace(NonDigits, ""));

		if (!infID || infID >= 2147483647 || infID <= 0)
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild.id, {
					arg_expected: "id:Number",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		const inf = await infractionsManager.getInfraction(context.guild.id, Number(args[0].replace(NonDigits, "")));

		if (!inf) {
			return context.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", context.guild.id, {
					infraction_id: args[0].replace(NonDigits, ""),
				}),
			);
		}

		const user = await this.client.bulbfetch.getUser(inf.targetId);
		const target = { tag: inf.target, id: inf.targetId };
		const moderator = { tag: inf.moderator, id: inf.moderatorId };

		let description = "";
		description += await this.client.bulbutils.translate("infraction_info_inf_id", context.guild.id, { infraction_id: args[0] });
		description += await this.client.bulbutils.translate("infraction_info_target", context.guild.id, { target });
		description += await this.client.bulbutils.translate("infraction_info_moderator", context.guild.id, { moderator });
		description += await this.client.bulbutils.translate("infraction_info_created", context.guild.id, {
			created: moment(inf.createdAt).format("MMM Do YYYY, h:mm:ss a"),
		});

		if (inf.timeout) {
			description += await this.client.bulbutils.translate("infraction_info_expires", context.guild.id, {
				expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.timeout)).format("MMM Do YYYY, h:mm:ss a")}`,
			});
		}
		description += await this.client.bulbutils.translate("infraction_info_reason", context.guild.id, { reason: inf.reason });

		description += await this.client.bulbutils.translate("infraction_info_active", context.guild.id, { active: this.client.bulbutils.prettify(`${inf.active}`) });

		const image = inf.reason.match(ReasonImage);

		const embed: MessageEmbed = new MessageEmbed()
			.setTitle(this.client.bulbutils.prettify(inf.action))
			.setDescription(description)
			.setColor(embedColor)
			// We should probably just not call this if `image` is null
			.setImage(image ? image[0] : "")
			.setThumbnail(user?.avatarURL({ dynamic: true }) || "")
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild.id, { user: context.author }),
				iconURL: context.author.avatarURL() || "",
			})
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}

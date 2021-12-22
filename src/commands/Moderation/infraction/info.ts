import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import moment from "moment";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";
import { Infraction } from "../../../utils/types/DatabaseStructures";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "info",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["id:int32"],
			usage: "<id>",
			description: "Get information about an infraction.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const infID = Number(args[0].replace(NonDigits, ""));

		if (!infID || infID >= 2147483647 || infID <= 0)
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.int", context.guild?.id, {}),
					arg_expected: "id:int32",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		const inf: Infraction = <Infraction>await infractionsManager.getInfraction(<Snowflake>context.guild?.id, Number(args[0].replace(NonDigits, "")));

		if (!inf) {
			return context.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", context.guild?.id, {
					infraction_id: args[0].replace(NonDigits, ""),
				}),
			);
		}

		const user = await this.client.bulbfetch.getUser(inf.targetId);
		const target: Record<string, string> = { tag: inf.target, id: inf.targetId };
		const moderator: Record<string, string> = { tag: inf.moderator, id: inf.moderatorId };

		let description: string = "";
		description += await this.client.bulbutils.translate("infraction_info_inf_id", context.guild?.id, { infraction_id: args[0] });
		description += await this.client.bulbutils.translate("infraction_info_target", context.guild?.id, { target });
		description += await this.client.bulbutils.translate("infraction_info_moderator", context.guild?.id, { moderator });
		description += await this.client.bulbutils.translate("infraction_info_created", context.guild?.id, {
			created: moment(Date.parse(inf.createdAt)).format("MMM Do YYYY, h:mm:ss a"),
		});

		if (inf.active !== "false" && inf.active !== "true") {
			description += await this.client.bulbutils.translate("infraction_info_expires", context.guild?.id, {
				expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.active)).format("MMM Do YYYY, h:mm:ss a")}`,
			});
		} else {
			description += await this.client.bulbutils.translate("infraction_info_active", context.guild?.id, {
				active: this.client.bulbutils.prettify(inf.active),
			});
		}

		description += await this.client.bulbutils.translate("infraction_info_reason", context.guild?.id, { reason: inf.reason });

		const image = inf.reason.match(ReasonImage);

		const embed: MessageEmbed = new MessageEmbed()
			.setTitle(this.client.bulbutils.prettify(inf.action))
			.setDescription(description)
			.setColor(embedColor)
			.setImage(<string>(image ? image[0] : null))
			.setThumbnail(<string>user?.avatarURL({ dynamic: true }))
			.setFooter(await this.client.bulbutils.translate("global_executed_by", context.guild?.id, { user: context.author }), <string>context.author.avatarURL())
			.setTimestamp();

		await context.channel.send({ embeds: [embed] });
	}
}

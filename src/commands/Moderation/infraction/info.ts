import { SubCommand } from "../../../structures/SubCommand";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import Command from "../../../structures/Command";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import moment from "moment";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "info",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["user:User"],
			usage: "!inf info <user>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		const inf: Record<string, any> = <Record<string, any>>await infractionsManager.getInfraction(<Snowflake>message.guild?.id, Number(args[1].replace(NonDigits, "")));

		if (!inf) {
			return message.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", message.guild?.id, {
					infractionId: args[1].replace(NonDigits, ""),
				}),
			);
		}

		const user = await this.client.bulbutils.userObject(false, await this.client.users.fetch(inf["targetId"]));

		let description: string = "";
		description += await this.client.bulbutils.translate("infraction_info_inf_id", message.guild?.id, { infractionId: args[1] });
		description += await this.client.bulbutils.translate("infraction_info_target", message.guild?.id, {
			target_tag: inf["target"],
			target_id: inf["targetId"],
		});
		description += await this.client.bulbutils.translate("infraction_info_moderator", message.guild?.id, {
			moderator_tag: inf["moderator"],
			moderator_id: inf["moderatorId"],
		});
		description += await this.client.bulbutils.translate("infraction_info_created", message.guild?.id, {
			timestamp: moment(Date.parse(inf["createdAt"])).format("MMM Do YYYY, h:mm:ss a"),
		});

		if (inf["active"] !== "false" && inf["active"] !== "true") {
			description += await this.client.bulbutils.translate("infraction_info_expires", message.guild?.id, {
				timestamp: `${Emotes.status.ONLINE} ${moment(parseInt(inf["active"])).format("MMM Do YYYY, h:mm:ss a")}`,
			});
		} else {
			description += await this.client.bulbutils.translate("infraction_info_active", message.guild?.id, {
				emoji: this.client.bulbutils.prettify(inf["active"]),
			});
		}

		description += await this.client.bulbutils.translate("infraction_info_reason", message.guild?.id, {
			reason: inf["reason"],
		});

		const image = inf["reason"].match(ReasonImage);

		const embed: MessageEmbed = new MessageEmbed()
			.setTitle(this.client.bulbutils.prettify(inf["action"]))
			.setDescription(description)
			.setColor(embedColor)
			.setImage(image ? image[0] : null)
			.setThumbnail(user.avatarUrl)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				<string>message.author.avatarURL(),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}

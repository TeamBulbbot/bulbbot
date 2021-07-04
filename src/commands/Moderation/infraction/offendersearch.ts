import { SubCommand } from "../../../structures/SubCommand";
import { Message, MessageEmbed, Snowflake, User } from "discord.js";
import Command from "../../../structures/Command";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import * as Emotes from "../../../emotes.json";
import moment from "moment";
import { embedColor } from "../../../Config";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "offendersearch",
			aliases: ["osearch"],
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["user:User"],
			usage: "!inf modsearch <user>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		let pages: MessageEmbed[] = [];

		const targetID: Snowflake = args[1].replace(NonDigits, "");
		let user: User;
		try {
			user = await this.client.users.fetch(targetID);
		} catch (err) {
			return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
		}

		const infs: object[] = <object[]>await infractionsManager.getOffenderInfractions(<Snowflake>message.guild?.id, user.id);
		for (let i = 0; i < 50; i++) {
			if (infs[i] === undefined) continue;

			let description = "";
			description += await this.client.bulbutils.translate("infraction_info_inf_id", message.guild?.id, { infractionId: infs[i]["id"] });
			description += await this.client.bulbutils.translate("infraction_info_target", message.guild?.id, {
				target_tag: infs[i]["target"],
				target_id: infs[i]["targetId"],
			});
			description += await this.client.bulbutils.translate("infraction_info_moderator", message.guild?.id, {
				moderator_tag: infs[i]["moderator"],
				moderator_id: infs[i]["moderatorId"],
			});
			description += await this.client.bulbutils.translate("infraction_info_created", message.guild?.id, {
				timestamp: moment(Date.parse(infs[i]["createdAt"])).format("MMM Do YYYY, h:mm:ss a"),
			});

			if (infs[i]["active"] !== "false" && infs[i]["active"] !== "true") {
				description += await this.client.bulbutils.translate("infraction_info_expires", message.guild?.id, {
					timestamp: `${Emotes.status.ONLINE} ${moment(parseInt(infs[i]["active"])).format("MMM Do YYYY, h:mm:ss a")}`,
				});
			} else {
				description += await this.client.bulbutils.translate("infraction_info_active", message.guild?.id, {
					emoji: this.client.bulbutils.prettify(infs[i]["active"]),
				});
			}

			description += await this.client.bulbutils.translate("infraction_info_reason", message.guild?.id, {
				reason: infs[i]["reason"],
			});

			const image = infs[i]["reason"].match(ReasonImage);

			const embed: MessageEmbed = new MessageEmbed()
				.setTitle(this.client.bulbutils.prettify(infs[i]["action"]))
				.setDescription(description)
				.setColor(embedColor)
				.setImage(image ? image[0] : null)
				.setTimestamp();

			pages.push(embed);
		}

		if (pages.length === 0) return message.channel.send(await this.client.bulbutils.translate("infraction_list_not_found", message.guild?.id));

		await this.client.bulbutils.embedPage(message, pages, [Emotes.other.LEFT, Emotes.other.RIGHT], 120000);
	}
}

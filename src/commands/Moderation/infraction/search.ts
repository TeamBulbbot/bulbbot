import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, MessageEmbed, Snowflake, User } from "discord.js";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import moment from "moment";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";
import { Infraction } from "../../../utils/types/Infraction";
import BulbBotClient from "../../../structures/BulbBotClient";

const infractionManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "search",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["user:User"],
			usage: "<user>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let pages: MessageEmbed[] = [];
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let user: User;

		try {
			user = await this.client.users.fetch(targetID);
		} catch (err) {
			return message.channel.send(
				await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
			);
		}

		let infs: Infraction[] = <Infraction[]>await infractionManager.getAllUserInfractions(<string>message.guild?.id, user.id);

		for (let i = 0; i < 50; i++) {
			if (infs?.[i] === undefined) continue;

			const target: Record<string, string> = { tag: infs[i].target, id: infs[i].targetId };
			const moderator: Record<string, string> = { tag: infs[i].moderator, id: infs[i].moderatorId };

			let description: string = "";
			description += await this.client.bulbutils.translate("infraction_info_inf_id", message.guild?.id, { infraction_id: infs[i].id });
			description += await this.client.bulbutils.translate("infraction_info_target", message.guild?.id, { target });
			description += await this.client.bulbutils.translate("infraction_info_moderator", message.guild?.id, { moderator });
			description += await this.client.bulbutils.translate("infraction_info_created", message.guild?.id, {
				created: moment(Date.parse(infs[i].createdAt)).format("MMM Do YYYY, h:mm:ss a"),
			});

			if (infs[i].active !== "false" && infs[i].active !== "true") {
				description += await this.client.bulbutils.translate("infraction_info_expires", message.guild?.id, {
					expires: `${Emotes.status.ONLINE} ${moment(parseInt(infs[i].active)).format("MMM Do YYYY, h:mm:ss a")}`,
				});
			} else {
				description += await this.client.bulbutils.translate("infraction_info_active", message.guild?.id, {
					active: this.client.bulbutils.prettify(infs[i].active),
				});
			}

			description += await this.client.bulbutils.translate("infraction_info_reason", message.guild?.id, {
				reason: infs[i].reason,
			});

			const image = infs[i].reason.match(ReasonImage);

			const embed: MessageEmbed = new MessageEmbed()
				.setTitle(this.client.bulbutils.prettify(infs[i].action))
				.setDescription(description)
				.setColor(embedColor)
				.setImage(<string>(image ? image[0] : null))
				.setTimestamp();

			pages.push(embed);
		}

		if (pages.length === 0) return await message.channel.send(await this.client.bulbutils.translate("infraction_search_not_found", message.guild?.id, { target: user }));

		await this.client.bulbutils.embedPage(message, pages, [Emotes.other.LEFT, Emotes.other.RIGHT], 120000);
	}
}

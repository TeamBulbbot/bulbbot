import SubCommand from "../../../structures/SubCommand";
import { Message, MessageEmbed, Snowflake, User } from "discord.js";
import Command from "../../../structures/Command";
import { NonDigits, ReasonImage } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import * as Emotes from "../../../emotes.json";
import moment from "moment";
import { embedColor } from "../../../Config";
import { Infraction } from "../../../utils/types/Infraction";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "modsearch",
			aliases: ["msearch"],
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
			return message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.user", message.guild?.id, {}),
					arg_expected: "user:User",
					arg_provided: args[1],
					usage: this.usage,
				}),
			);
		}

		const infs: Infraction[] = <Infraction[]>await infractionsManager.getModeratorInfractions(<Snowflake>message.guild?.id, user.id);
		for (let i = 0; i < 50; i++) {
			if (infs[i] === undefined) continue;

			const target: Record<string, string> = { tag: infs[i].target, id: infs[i].targetId };
			const moderator: Record<string, string> = { tag: infs[i].moderator, id: infs[i].moderatorId };

			let description = "";
			description += await this.client.bulbutils.translateNew("infraction_info_inf_id", message.guild?.id, { infraction_id: infs[i].id });
			description += await this.client.bulbutils.translateNew("infraction_info_target", message.guild?.id, { target });
			description += await this.client.bulbutils.translateNew("infraction_info_moderator", message.guild?.id, { moderator });
			description += await this.client.bulbutils.translateNew("infraction_info_created", message.guild?.id, {
				created: moment(Date.parse(infs[i].createdAt)).format("MMM Do YYYY, h:mm:ss a"),
			});

			if (infs[i].active !== "false" && infs[i].active !== "true") {
				description += await this.client.bulbutils.translateNew("infraction_info_expires", message.guild?.id, {
					expires: `${Emotes.status.ONLINE} ${moment(parseInt(infs[i].active)).format("MMM Do YYYY, h:mm:ss a")}`,
				});
			} else {
				description += await this.client.bulbutils.translateNew("infraction_info_active", message.guild?.id, {
					active: this.client.bulbutils.prettify(infs[i].active),
				});
			}

			description += await this.client.bulbutils.translateNew("infraction_info_reason", message.guild?.id, {
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

		if (pages.length === 0) return message.channel.send(await this.client.bulbutils.translateNew("infraction_search_not_found", message.guild?.id, { target: user }));

		await this.client.bulbutils.embedPage(message, pages, [Emotes.other.LEFT, Emotes.other.RIGHT], 120000);
	}
}

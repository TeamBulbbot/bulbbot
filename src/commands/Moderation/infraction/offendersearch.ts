import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, MessageActionRow, MessageSelectMenu, Snowflake, User } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import { Infraction } from "../../../utils/types/Infraction";
import BulbBotClient from "../../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "offendersearch",
			aliases: ["osearch"],
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["user:User"],
			usage: "<user>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let user: User;
		try {
			user = await this.client.users.fetch(targetID);
		} catch (err) {
			return message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});
		}

		let options: any[] = [];
		const infs: Infraction[] = <Infraction[]>await infractionsManager.getOffenderInfractions(<Snowflake>message.guild?.id, user.id);

		if (!infs.length) return await message.channel.send(await this.client.bulbutils.translate("infraction_search_not_found", message.guild?.id, { target: user }));

		for (let i = 0; i < 25; i++) {
			if (infs[i] === undefined) continue;

			options.push({
				label: `${infs[i].action} (#${infs[i].id})`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", message.guild?.id, {}),
				value: `inf_${infs[i].id}`,
				emoji: this.client.bulbutils.formatAction(infs[i].action),
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("infraction_interaction_placeholder", message.guild?.id, {}))
				.setCustomId("infraction")
				.addOptions(options),
		);

		return await message.channel.send({
			content: await this.client.bulbutils.translate("infraction_interaction_reply", message.guild?.id, {
				target: user,
			}),
			components: [row],
		});
	}
}

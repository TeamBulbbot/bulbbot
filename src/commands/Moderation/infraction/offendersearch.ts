import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageActionRow, MessageSelectMenu, Snowflake, User } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import { Infraction } from "../../../utils/types/Infraction";

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

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let user: User | undefined = await this.client.bulbfetch.getUser(targetID);

		if (!user)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
			);

		let options: any[] = [];
		const infs: Infraction[] = <Infraction[]>await infractionsManager.getOffenderInfractions(<Snowflake>context.guild?.id, user.id);

		if (!infs.length) return await context.channel.send(await this.client.bulbutils.translate("infraction_search_not_found", context.guild?.id, { target: user }));

		for (let i = 0; i < 25; i++) {
			if (infs[i] === undefined) continue;

			options.push({
				label: `${infs[i].action} (#${infs[i].id})`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", context.guild?.id, {}),
				value: `inf_${infs[i].id}`,
				emoji: this.client.bulbutils.formatAction(infs[i].action),
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("infraction_interaction_placeholder", context.guild?.id, {}))
				.setCustomId("infraction")
				.addOptions(options),
		);

		return await context.channel.send({
			content: await this.client.bulbutils.translate("infraction_interaction_reply", context.guild?.id, {
				target: user,
			}),
			components: [row],
		});
	}
}

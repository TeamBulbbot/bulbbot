import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import Command from "../../../structures/Command";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import { NonDigits } from "../../../utils/Regex";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "update",
			clearance: 50,
			minArgs: 2,
			maxArgs: -1,
			argList: ["infraction:int", "reason:string"],
			usage: "!inf update <infraction> <reason>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		if (!(await infractionsManager.getInfraction(<Snowflake>message.guild?.id, Number(args[1].replace(NonDigits, ""))))) {
			return message.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", message.guild?.id, {
					infractionId: args[1],
				}),
			);
		}

		const reason = args.slice(2).join(" ");
		await infractionsManager.updateReason(<Snowflake>message.guild?.id, Number(args[1]), reason);
		return message.channel.send(await this.client.bulbutils.translate("infraction_update_success", message.guild?.id, { infractionId: args[1] }));
	}
}

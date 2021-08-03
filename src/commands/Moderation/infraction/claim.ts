import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake, User } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import { NonDigits } from "../../../utils/Regex";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "claim",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["infraction:int"],
			usage: "inf claim <infraction>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		if ((await infractionsManager.getInfraction(<Snowflake>message.guild?.id, Number(args[0].replace(NonDigits, "")))) === undefined) {
			return message.channel.send(
				await this.client.bulbutils.translateNew("infraction_not_found", message.guild?.id, {
					infraction_id: args[0],
				}),
			);
		}

		await infractionsManager.updateModerator(<Snowflake>message.guild?.id, Number(args[0].replace(NonDigits, "")), <User>message.member?.user);
		return await message.channel.send(await this.client.bulbutils.translateNew("infraction_claim_success", message.guild?.id, { infraction_id: args[0] }));
	}
}

import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import SubCommand from "../../../structures/SubCommand";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "disable",
			minArgs: 1,
			maxArgs: 1,
			argList: ["command:string"],
			usage: "configure override disable <command>",
		});
	}

	async run( message: Message, args: string[]): Promise<void | Message> {
		const command: string = args[0];
		const cTemp = this.client.commands.get(command.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(command.toLowerCase()));
		if (cTemp === undefined)
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
					arg: args[0],
					arg_expected: "command:string",
					usage: this.client.prefix + "configure override disable <command>",
				}),
			);

		if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, cTemp.name)) !== undefined) {
			await clearanceManager.setEnabled(<Snowflake>message.guild?.id, cTemp.name, false);
		} else {
			await clearanceManager.createCommandOverride(<Snowflake>message.guild?.id, cTemp.name, false, cTemp.clearance);
		}


		await message.channel.send(await this.client.bulbutils.translate("override_disable_success", message.guild?.id, { command }));
	}
}

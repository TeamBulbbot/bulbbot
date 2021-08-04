import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "enable",
			minArgs: 1,
			maxArgs: 1,
			argList: ["command:string"],
			usage: "<command>",
		});
	}

	async run( message: Message, args: string[]): Promise<void | Message> {
		const command = args[0];
		const cTemp = this.client.commands.get(command.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(command.toLowerCase()));
		if (!cTemp)
			return message.channel.send(
				await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild?.id, {
					argument: args[0],
					arg_expected: this.argList[0],
					usage: this.usage,
				}),
			);

		if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, cTemp.name)) !== undefined) {
			await clearanceManager.setEnabled(<Snowflake>message.guild?.id, cTemp.name, true);
		} else {
			return message.channel.send(await this.client.bulbutils.translateNew("override_nonexistent_command", message.guild?.id, { name: command }));
		}

		await message.channel.send(await this.client.bulbutils.translate("override_enable_success", message.guild?.id, { command }));
	}
}

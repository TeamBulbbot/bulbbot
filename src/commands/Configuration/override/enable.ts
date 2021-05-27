import BulbBotClient from "../../../structures/BulbBotClient";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default async function (client: BulbBotClient, message: Message, args: string[]): Promise<void | Message> {
	const command: string = args[2];
	if (!command)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
				arg: args[2],
				arg_expected: "command:string",
				usage: "!configure override enable <command>",
			}),
		);
	const cTemp = client.commands.get(command.toLowerCase()) || client.commands.get(<string>client.aliases.get(command.toLowerCase()));
	if (cTemp === undefined)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
				arg: args[2],
				arg_expected: "command:string",
				usage: "!configure override disable <command>",
			}),
		);

	if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, cTemp.name)) !== undefined) {
		await clearanceManager.setEnabled(<Snowflake>message.guild?.id, cTemp.name, true);
	}

	await message.channel.send(await client.bulbutils.translate("override_enable_success", message.guild?.id, { command }));
}
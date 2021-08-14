import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../../utils/managers/ClearanceManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "disable",
			minArgs: 1,
			maxArgs: 1,
			argList: ["command:string"],
			usage: "<command>",
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		const command: string = args[0];
		const cTemp = this.client.commands.get(command.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(command.toLowerCase()));
		if (cTemp === undefined || cTemp.name === undefined)
			return message.channel.send(
				await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.cmd", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "command:string",
					usage: this.usage,
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

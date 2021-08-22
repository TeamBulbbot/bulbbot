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
			maxArgs: -1,
			argList: ["command:string"],
			usage: "<command>",
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		const command = Command.resolve(this.client, args);
		if (command === undefined || command.name === undefined)
			return message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.cmd", message.guild?.id, {}),
					arg_provided: args.join(" "),
					arg_expected: "command:string",
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});

		if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, command.qualifiedName)) !== undefined) {
			await clearanceManager.setEnabled(<Snowflake>message.guild?.id, command.qualifiedName, false);
		} else {
			await clearanceManager.createCommandOverride(<Snowflake>message.guild?.id, command.qualifiedName, false, command.clearance);
		}

		await message.channel.send(await this.client.bulbutils.translate("override_disable_success", message.guild?.id, { command: command.qualifiedName }));
	}
}

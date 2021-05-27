import { SubCommand } from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import Command from "../../../structures/Command";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "prefix",
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["prefix:string"],
			usage: "!configure prefix <prefix>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		const prefix = args[1];

		if (prefix.length > 255) return message.channel.send(await this.client.bulbutils.translate("config_prefix_too_long", message.guild?.id));

		await databaseManager.setPrefix(<Snowflake>message.guild?.id, prefix);

		await message.channel.send(await this.client.bulbutils.translate("config_prefix_success", message.guild?.id, { prefix }));
	}
}
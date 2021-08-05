import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "prefix",
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["prefix:string"],
			usage: "<prefix>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const prefix = args[0];

		if (prefix.length > 255) return message.channel.send(await this.client.bulbutils.translateNew("config_prefix_too_long", message.guild?.id, {}));

		await databaseManager.setPrefix(<Snowflake>message.guild?.id, prefix);

		await message.channel.send(await this.client.bulbutils.translateNew("config_prefix_success", message.guild?.id, { prefix }));
	}
}

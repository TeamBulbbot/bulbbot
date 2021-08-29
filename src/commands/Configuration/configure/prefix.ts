import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
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
			argList: ["prefix:string"],
			usage: "<prefix>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const prefix = args[0];

		if (prefix.length > 255) return context.channel.send(await this.client.bulbutils.translate("config_prefix_too_long", context.guild?.id, {}));

		await databaseManager.setPrefix(<Snowflake>context.guild?.id, prefix);

		await context.channel.send(await this.client.bulbutils.translate("config_prefix_success", context.guild?.id, { prefix }));
	}
}

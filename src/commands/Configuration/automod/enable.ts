import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import Command from "../../../structures/Command";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "enable",
			clearance: 75,
			maxArgs: 0,
			usage: "!automod enable",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void> {
		await databaseManager.enableAutomod(message.guild!.id, true);
		await message.channel.send(await this.client.bulbutils.translateNew("automod_enabled", message.guild?.id, {}));
	}
}

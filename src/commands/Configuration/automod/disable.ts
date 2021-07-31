import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import Command from "../../../structures/Command";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "disable",
			clearance: 75,
			usage: "!automod disable",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		await databaseManager.enableAutomod(message.guild!.id, false);
		await message.channel.send(await this.client.bulbutils.translateNew("automod_disabled", message.guild?.id, {}));
	}
}

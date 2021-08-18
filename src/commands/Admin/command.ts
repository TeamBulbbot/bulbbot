import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";

import load from "./command/load";
import unload from "./command/unload";
import reload from "./command/reload";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			aliases: ["cmd"],
			description: "Command control commands",
			category: "Admin",
			subCommands: [load, unload, reload],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			devOnly: true,
		});
	}
}

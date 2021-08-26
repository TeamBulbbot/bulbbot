import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import create from "./banpool/create";
import _delete from "./banpool/delete";
import invite from "./banpool/invite";
import leave from "./banpool/leave";
import list from "./banpool/list";
import remove from "./banpool/remove";
import join from "./banpool/join";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Too be written",
			category: "Configuration",
			subCommands: [create, _delete, invite, join, leave, list, remove],
			aliases: ["bp"],
			usage: "<action>",
			examples: ["banpool invite <poolName>", "banpool remove <guildId>", "banpool delete <poolName>"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			premium: true,
		});
	}
}

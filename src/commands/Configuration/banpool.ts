import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import create from "./banpool/create";
import _delete from "./banpool/delete";
import invite from "./banpool/invite";
import leave from "./banpool/leave";
import remove from "./banpool/remove";
import join from "./banpool/join";
import info from "./banpool/info";
import list from "./banpool/list";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Manage banpools.",
			category: "Configuration",
			subCommands: [create, _delete, invite, join, leave, remove, info, list],
			aliases: ["bp"],
			usage: "<action>",
			examples: ["banpool invite <pool-name>", "banpool remove <guildId>", "banpool delete <pool-name>"],
			argList: ["action:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			premium: true,
		});
	}
}

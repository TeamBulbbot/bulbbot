import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";

import enable from "./automod/enable";
import settings from "./automod/settings";
import add from "./automod/add";
import disable from "./automod/disable";
import remove from "./automod/remove";
import punishment from "./automod/punishment";
import limit from "./automod/limit";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "automod",
			description: "Configure the automod in your server",
			category: "Configuration",
			subCommands: [enable, settings, add, disable, remove, punishment, limit],
			aliases: ["am"],
			usage: "<action>",
			examples: ["configure automod enable", "configure automod edit", "configure automod punishment"],
			argList: ["action:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["EMBED_LINKS"],
		});
	}
}

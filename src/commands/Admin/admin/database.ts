import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import add from "./database/add";
import remove from "./database/remove";
import info from "./database/info";
import reset from "./database/reset";
import clearmessages from "./database/clearmessages";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "database",
			aliases: ["db"],
			subCommands: [add, remove, info, reset, clearmessages],
			minArgs: 1,
			maxArgs: 1,
			argList: ["type:String"],
			usage: "<type>",
		});
	}
}

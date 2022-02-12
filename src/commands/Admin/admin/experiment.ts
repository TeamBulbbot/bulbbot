import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import add from "./experiment/add";
import info from "./experiment/info";
import remove from "./experiment/remove";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "experiment",
			subCommands: [add, info, remove],
			minArgs: 1,
			maxArgs: 1,
			argList: ["type:String"],
			usage: "<type>",
		});
	}
}

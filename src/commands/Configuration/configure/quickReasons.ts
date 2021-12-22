import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import add from "./quickReasons/add";
import remove from "./quickReasons/remove";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "quick_reasons",
			aliases: ["quickreasons"],
			subCommands: [add, remove],
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			description: "Configure quick reasons.",
		});
	}
}

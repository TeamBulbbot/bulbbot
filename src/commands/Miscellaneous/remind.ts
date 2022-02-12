import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";
import list from "./remind/list";
import remove from "./remind/remove";
import set from "./remind/set";

// TODO move these to translator

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			aliases: ["r"],
			description: "Remind yourself for things in the future",
			category: "Miscellaneous",
			subCommands: [remove, list, set],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:String"],
		});
	}
}

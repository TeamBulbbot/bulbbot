import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import enable from "./premium/enable";
import disable from "./premium/disable";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "premium",
			subCommands: [enable, disable],
			minArgs: 1,
			maxArgs: 1,
			argList: ["type:string"],
			usage: "<type>",
		});
	}
}

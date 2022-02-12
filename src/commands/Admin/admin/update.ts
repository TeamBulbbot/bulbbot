import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import code from "./update/code";
import build from "./update/build";
import force from "./update/force";
import packages from "./update/packages";
import full from "./update/full";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "update",
			aliases: ["u"],
			subCommands: [code, build, force, packages, full],
			minArgs: 1,
			maxArgs: 1,
			argList: ["type:String"],
			usage: "<type>",
		});
	}
}

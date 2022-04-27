import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";
import botfarm from "./admin/botfarm";
import database from "./admin/database";
import experiment from "./admin/experiment";
import join from "./admin/join";
import leave from "./admin/leave";
import premium from "./admin/premium";
import restart from "./admin/restart";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Admin commands",
			category: "Admin",
			subCommands: [leave, join, database, restart, premium, botfarm, experiment],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:String"],
			devOnly: true,
		});
	}
}

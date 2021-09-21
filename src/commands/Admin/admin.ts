import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";
import botfarm from "./admin/botfarm";
import clearfiles from "./admin/clearfiles";
import database from "./admin/database";
import join from "./admin/join";
import leave from "./admin/leave";
import premium from "./admin/premium";
import restart from "./admin/restart";
import update from "./admin/update";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Admin commands",
			category: "Admin",
			subCommands: [clearfiles, leave, join, database, update, restart, premium, botfarm],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			devOnly: true,
		});
	}
}

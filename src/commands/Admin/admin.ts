import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";
import clearfiles from "./admin/clearfiles";
import database from "./admin/database";
import join from "./admin/join";
import leave from "./admin/leave";
import restart from "./admin/restart";
import update from "./admin/update";

// consider refactor such that a single subcommand "db" with subcommands "add", "info", "reset", "yeet", would take care of the current "db-" commands
// +1 // philip
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Admin commands",
			category: "Admin",
			subCommands: [clearfiles, leave, join, database, update, restart],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			devOnly: true,
		});
	}
}

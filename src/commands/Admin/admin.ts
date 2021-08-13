import Command from "../../structures/Command";
import clearfiles from "./admin/clearfiles";
import leave from "./admin/leave";
import join from "./admin/join";
import dbAdd from "./admin/db-add";
import dbInfo from "./admin/db-info";
import dbReset from "./admin/db-reset";
import dbYeet from "./admin/db-yeet";
import BulbBotClient from "../../structures/BulbBotClient";
import update from "./admin/update";

// consider refactor such that a single subcommand "db" with subcommands "add", "info", "reset", "yeet", would take care of the current "db-" commands
// +1 // philip
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Admin commands",
			category: "Admin",
			subCommands: [clearfiles, leave, join, dbAdd, dbInfo, dbReset, dbYeet, update],
			usage: "<action>",
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			devOnly: true,
		});
	}
}

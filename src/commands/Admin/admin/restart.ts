import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import { exec } from "shelljs";
import { pm2Name } from "../../../Config";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "restart",
			usage: "restart",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		// restarts the bot
		context.reply("Restarting the bot now!");

		exec(`pm2 restart ${pm2Name}`);
	}
}

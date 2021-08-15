import { Message } from "discord.js";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import { exec } from "shelljs";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "restart",
			usage: "restart",
		});
	}

	public async run(message: Message): Promise<void | Message> {
		// restarts the bot
		const PM2_PROCESS: String = "bulbbot";

		message.reply("Restarting the bot now!");

		exec(`pm2 restart ${PM2_PROCESS}`);
	}
}

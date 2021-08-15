import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import ReminderManager from "../../../utils/managers/ReminderManager";

const { deleteUserReminder }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "remove",
			aliases: ["yeet", "delete"],
			minArgs: 1,
			maxArgs: 1,
			argList: ["id:number"],
			usage: "<id>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		console.log(await deleteUserReminder(args[0], message.author.id));
	}
}

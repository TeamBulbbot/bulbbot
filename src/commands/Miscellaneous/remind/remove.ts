import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import ReminderManager from "../../../utils/managers/ReminderManager";
import { NonDigits } from "../../../utils/Regex";

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
		const reminderId: number = Number(args[0].replace(NonDigits, ""));
		const allowedToDelete: boolean = await deleteUserReminder(reminderId, message.author.id);

		if (!allowedToDelete)
			return message.reply(
				await this.client.bulbutils.translate("remind_remove_unable_to_find", message.guild?.id, {
					reminderId,
				}),
			);
		else message.reply(await this.client.bulbutils.translate("remind_remove_removed", message.guild?.id, { reminderId }));
	}
}

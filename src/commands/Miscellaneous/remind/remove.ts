import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
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
			argList: ["id:Number"],
			usage: "<id>",
			description: "Removes a reminder by its ID.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const reminderId = Number(args[0].replace(NonDigits, ""));
		const allowedToDelete: boolean = await deleteUserReminder(reminderId, context.author.id);

		if (!allowedToDelete)
			return context.channel.send(
				await this.client.bulbutils.translate("remind_remove_unable_to_find", context.guild?.id, {
					reminderId,
				}),
			);
		else context.channel.send(await this.client.bulbutils.translate("remind_remove_removed", context.guild?.id, { reminderId }));
	}
}

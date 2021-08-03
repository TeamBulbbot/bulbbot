import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import AutoModPart, { AutoModListPart } from "../../../utils/types/AutoModPart";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "remove",
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["item:string"],
			usage: "automod remove <item> [items...]",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const partArg: string = args[0];
		const items: string[] = args.slice(1);

		if (!partArg)
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", message.guild!.id, {
					arg: "part:string",
					arg_expected: 3,
					arg_provided: 1,
					usage: "`website`, `invites`, `words` or `words_token`",
				}),
			);

		const partexec = /^(website|invite|word)s?$|^(?:words?_?)?(token)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
		return message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild!.id, {
				arg: partArg,
				arg_expected: "part:string",
				usage: "`website`, `invites`, `words` or `words_token`",
			}),
		);
		const partString = partexec[1] ?? partexec[2];

		if (!items.length) return message.channel.send(await this.client.bulbutils.translate("automod_missing_item_remove", message.guild!.id));

		const part: AutoModListPart = AutoModPart[partString];
		const result = await databaseManager.automodRemove(message.guild!.id, part, items);

		if (!result.removed.length) return message.channel.send(await this.client.bulbutils.translate("automod_not_already_in_database", message.guild!.id, { item: items.join("`, `") }));

		message.channel.send(await this.client.bulbutils.translate("automod_removed_from_the_database", message.guild!.id, { part: partArg, item: result.removed.join("`, `") }));
	}
}

import { Message } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import AutoModPart, { AutoModListPart } from "../../../../utils/types/AutoModPart";
import BulbBotClient from "../../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "remove",
			clearance: 75,
			minArgs: 2,
			maxArgs: -1,
			argList: ["part:string", "item:string"],
			usage: "<part> <item> [items...]",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const partArg: string = args[0];
		const items: string[] = args.slice(1);

		const partexec = /^(website|invite|word)s?$|^(?:words?_?)?(token)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", message.guild!.id, {
					argument: partArg,
					arg_expected: "part:string",
					argument_list: "`website`, `invites`, `words` or `words_token`",
				}),
			);
		const partString = partexec[1] ?? partexec[2];

		if (!items.length) return message.channel.send(await this.client.bulbutils.translate("global_error.automod_items_length_undefined", message.guild!.id, {}));

		const part: AutoModListPart = AutoModPart[partString];
		const result = await databaseManager.automodRemove(message.guild!.id, part, items);

		if (!result.removed.length) return message.channel.send(await this.client.bulbutils.translate("automod_not_in_database", message.guild!.id, { item: items.join("`, `") }));

		await message.channel.send(
			await this.client.bulbutils.translate("automod_remove_success", message.guild!.id, {
				category: partArg,
				item: result.removed.join("`, `"),
			}),
		);
	}
}
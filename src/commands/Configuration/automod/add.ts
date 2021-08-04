import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import AutoModPart, { AutoModListPart } from "../../../utils/types/AutoModPart";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "add",
			clearance: 75,
			minArgs: 2,
			maxArgs: -1,
			usage: "<part> <item> [items...]",
			argList: ["part:string", "item:string"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const partArg: string = args[0];
		const items: string[] = args.slice(1);

		const partexec = /^(website|invite|word)s?$|^(?:words?_?)?(token)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
		return message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild!.id, {
				argument: partArg,
				arg_expected: "part:string",
				usage: "`website`, `invites`, `words` or `words_token`",
			}),
		);
		const partString = partexec[1] ?? partexec[2];

		if (!items.length) return message.channel.send(await this.client.bulbutils.translate("global_unknown_error", message.guild!.id)); // more specific error message help wanted

		const part: AutoModListPart = AutoModPart[partString];
		const result = await databaseManager.automodAppend(message.guild!.id, part, items);

		if (!result.added.length) return message.channel.send(await this.client.bulbutils.translate("automod_already_in_database", message.guild!.id, { item: items.join("`, `") }));
		message.channel.send(await this.client.bulbutils.translate("automod_added_to_the_database", message.guild!.id, { part: partArg, item: result.added.join("`, `") }));
	}
}

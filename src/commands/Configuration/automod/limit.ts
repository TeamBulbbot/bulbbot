import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import AutoModPart, { AutoModAntiSpamPart } from "../../../utils/types/AutoModPart";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "limit",
			clearance: 75,
			minArgs: 2,
			maxArgs: 2,
			argList: ["part:string", "limit:number"],
			usage: "<part> <limit>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const partArg = args[0];
		const limit = Number(args[1]);

		const partexec = /^(message|mention)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
		return message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild!.id, {
				arg: partArg,
				arg_expected: "part:string",
				usage: "`website`, `invites`, `words` or `words_token`",
			}),
		);
		const partString = partexec[1];

		if (isNaN(limit)) return message.channel.send(await this.client.bulbutils.translate("automod_non_number", message.guild!.id, { limit }));

		const part: AutoModAntiSpamPart = AutoModPart[partString];
		await databaseManager.automodSetLimit(message.guild!.id, part, limit >= 0 ? limit : 0);

		message.channel.send(await this.client.bulbutils.translate("automod_updated_limit", message.guild!.id, { part: partArg, limit }));
	}
}

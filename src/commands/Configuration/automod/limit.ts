import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import AutoModPart, { AutoModAntiSpamPart } from "../../../utils/types/AutoModPart";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "limit",
			clearance: 75,
			minArgs: 2,
			maxArgs: 2,
			argList: ["part:string", "limit:number"],
			usage: "!automod limit <part> <limit>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		console.log(args)
		const partArg = args[1];
		const limit = Number(args[2]);

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

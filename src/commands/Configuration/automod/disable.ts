import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import AutoModPart from "../../../utils/types/AutoModPart";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "disable",
			clearance: 75,
			maxArgs: 1,
			usage: "[part]",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const partArg = args[0];
		if(!partArg) {
			await databaseManager.enableAutomod(message.guild!.id, false);
			await message.channel.send(await this.client.bulbutils.translateNew("automod_disabled", message.guild?.id, {}));
		} else {
			const partexec = /^(message|mention|website|invite|word|token)s?$|^word_?(token)s?$/.exec(partArg.toLowerCase());
			if (!partexec)
			return message.channel.send(
				await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild!.id, {
					argument: partArg,
					arg_expected: "part:string",
					usage: "`website`, `invites`, `words`, `word_tokens`, `mentions` or `messages`",
				}),
			);
			const partString = partexec[1] ?? partexec[2];

			const part: AutoModPart = AutoModPart[partString];
			await databaseManager.automodSetPunishment(message.guild!.id, part, null);
			await message.channel.send(await this.client.bulbutils.translateNew("automod_disabled_part", message.guild?.id, {category: partArg}));
		}
	}
}

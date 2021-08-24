import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import AutoModPart from "../../../../utils/types/AutoModPart";
import BulbBotClient from "../../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "disable",
			clearance: 75,
			maxArgs: 1,
			usage: "[part]",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const partArg = args[0];
		if (!partArg) {
			await databaseManager.enableAutomod(context.guild!.id, false);
			await context.channel.send(await this.client.bulbutils.translate("automod_disabled", context.guild?.id, {}));
		} else {
			const partexec = /^(message|mention|website|invite|word|token)s?$|^word_?(token)s?$/.exec(partArg.toLowerCase());
			if (!partexec)
				return context.channel.send(
					await this.client.bulbutils.translate("event_message_args_unexpected", context.guild!.id, {
						argument: partArg,
						arg_expected: "part:string",
						usage: "`website`, `invites`, `words`, `word_tokens`, `mentions` or `messages`",
					}),
				);
			const partString = partexec[1] ?? partexec[2];

			const part: AutoModPart = AutoModPart[partString];
			await databaseManager.automodSetPunishment(context.guild!.id, part, null);
			await context.channel.send(await this.client.bulbutils.translate("automod_disabled_part", context.guild?.id, { category: partArg }));
		}
	}
}

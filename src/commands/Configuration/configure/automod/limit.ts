import BulbBotClient from "../../../../structures/BulbBotClient";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import { Message } from "discord.js";
import AutoModPart, { AutoModAntiSpamPart } from "../../../../utils/types/AutoModPart";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "limit",
			clearance: 75,
			minArgs: 3,
			maxArgs: 3,
			argList: ["part:string", "limit:number", "timeout:number"],
			usage: "<part> <limit>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const partArg = args[0];
		const limit = Number(args[1]);
		const timeout = Number(args[2]);

		const partexec = /^(message|mention)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
			return context.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", context.guild!.id, {
					argument: args[0],
					arg_expected: "part:string",
					argument_list: "`messages` or `mentions`",
				}),
			);
		const partString = partexec[1];

		if (isNaN(limit))
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild!.id, {
					arg_provided: args[1],
					arg_expected: "limit:int",
					usage: this.usage,
				}),
			);

		if (isNaN(timeout))
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: args[2],
					arg_expected: "timeout:int",
					usage: this.usage,
				}),
			);

		if (timeout > 30) return context.channel.send(await this.client.bulbutils.translate("automod_timeout_too_large", context.guild?.id, {}));

		const part: AutoModAntiSpamPart = AutoModPart[partString];
		await databaseManager.automodSetLimit(context.guild!.id, part, limit);
		await databaseManager.automodSetTimeout(context.guild!.id, part, timeout * 1000);

		await context.channel.send(
			await this.client.bulbutils.translate("automod_updated_limit", context.guild!.id, {
				category: partArg,
				limit: `${limit}/${timeout}s`,
			}),
		);
	}
}

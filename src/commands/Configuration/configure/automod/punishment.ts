import { Message } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import AutoModPart from "../../../../utils/types/AutoModPart";
import PunishmentType from "../../../../utils/types/PunishmentType";
import BulbBotClient from "../../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "punishment",
			aliases: ["punish"],
			clearance: 75,
			minArgs: 2, // perhaps `!automod punishment <part>` could return the current setting
			maxArgs: 2,
			argList: ["part:string", "punishment:string"],
			usage: "<part> <punishment>",
			description: "Sets the punishment for a part of the automod system.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const partArg = args[0];
		const itemArg = args[1];

		const partexec = /^(message|mention|website|invite|word|avatars|token)s?$|^word_?(token)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
			return context.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", context.guild!.id, {
					argument: args[0],
					arg_expected: "part:string",
					argument_list: "`website`, `invites`, `words`, `word_tokens`, `mentions`, `avatars` or `messages`",
				}),
			);
		const partString = partexec[1];

		const itemexec = /^(NONE|LOG|WARN|KICK|BAN)$/.exec(itemArg.toUpperCase());
		if (!itemexec)
			return context.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", context.guild!.id, {
					argument: itemArg,
					arg_expected: "punishment:string",
					argument_list: "`LOG`, `WARN`, `KICK` or `BAN`", // include none ? or leave as undocumented QoL
				}),
			);
		const itemString = itemexec[1];

		const part: AutoModPart = AutoModPart[partString];
		const item: PunishmentType | null = itemString !== "NONE" ? PunishmentType[itemString] : null;
		await databaseManager.automodSetPunishment(context.guild!.id, part, item);

		await context.channel.send(
			await this.client.bulbutils.translate("automod_updated_punishment", context.guild!.id, {
				category: partArg,
				punishment: itemArg,
			}),
		);
	}
}

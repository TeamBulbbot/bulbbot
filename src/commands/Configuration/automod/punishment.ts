import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import Command from "../../../structures/Command";
import AutoModPart from "../../../utils/types/AutoModPart";
import PunishmentType from "../../../utils/types/PunishmentType";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "punishment",
			aliases: ["punish"],
			clearance: 75,
			minArgs: 2, // perhaps `!automod punishment <part>` could return the current setting
			maxArgs: 2,
			argList: ["part:string", "punishment:string"],
			usage: "!automod punishment <part> <punishment>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		const partArg = args[1];
		const itemArg = args[2];

		const partexec = /^(message|mention|website|invite|word|token)s?$|^word_?(token)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
		return message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild!.id, {
				arg: partArg,
				arg_expected: "part:string",
				usage: "`website`, `invites`, `words`, `word_tokens`, `mentions` or `messages`",
			}),
		);
		const partString = partexec[1];

		const itemexec = /^(NONE|LOG|WARN|KICK|BAN)$/.exec(itemArg.toUpperCase());
		if (!itemexec)
		return message.channel.send(
			await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild!.id, {
				arg: partArg,
				arg_expected: "punishment:string",
				usage: "`LOG`, `WARN`, `KICK` or `BAN`", // include none ? or leave as undocumented QoL
			}),
		);
		const itemString = itemexec[1];

		const part: AutoModPart = AutoModPart[partString];
		const item: PunishmentType | null = itemString !== "NONE" ? PunishmentType[itemString] : null;
		await databaseManager.automodSetPunishment(message.guild!.id, part, item);

		message.channel.send(await this.client.bulbutils.translate("automod_updated_punishment", message.guild!.id, { part: partArg, punishment: itemArg }));
	}
}

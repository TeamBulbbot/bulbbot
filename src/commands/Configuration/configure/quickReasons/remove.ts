import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";
import Command from "../../../../structures/Command";
import CommandContext from "../../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../../utils/types/DatabaseStructures";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "remove",
			aliases: ["delete", "del"],
			clearance: 75,
			minArgs: 1,
			maxArgs: -1,
			argList: ["reason:string"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const reason = args.slice(0).join(" ");
		const config: GuildConfiguration = await databaseManager.getConfig(context.guild!.id);

		if (!config.quickReasons.includes(reason)) {
			return context.channel.send(await this.client.bulbutils.translate("config_quick_reasons_not_found", context.guild!.id, { reason }));
		}

		await databaseManager.removeQuickReason(context.guild!.id, reason);
		await context.channel.send(
			await this.client.bulbutils.translate("config_generic_success_remove", context.guild?.id, {
				setting: "quick_reasons",
				value: reason,
			}),
		);
	}
}

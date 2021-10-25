import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";

const { doesbanpoolExist, createBanpool, joinBanpool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();
const { sendEventLog }: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "create",
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool name:string"],
			usage: "<pool name>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const name: string = args[0];

		if (!(await hasBanpoolLog(context.guild!?.id))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));
		if (await doesbanpoolExist(name)) return context.channel.send(await this.client.bulbutils.translate("banpool_create_name_exists", context.guild?.id, {}));

		await createBanpool(context.guild!?.id, name);
		!(await joinBanpool(
			{
				banpool: {
					name,
				},
			},
			context.guild!?.id,
		));

		await sendEventLog(
			this.client,
			context.guild!,
			"banpool",
			await this.client.bulbutils.translate("banpool_create_log", context.guild?.id, {
				user: context.user,
				name,
			}),
		);

		context.channel.send(
			await this.client.bulbutils.translate("banpool_create_success", context.guild?.id, {
				name,
			}),
		);
	}
}

import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BanpoolManager from "../../../utils/managers/BanpoolManager";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { isGuildInPool, haveAccessToPool, leavePool, getCreatorGuild, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "leave",
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool-name:String"],
			usage: "<pool-name>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const name: string = args[0];

		if (!(context.guild?.id && (await hasBanpoolLog(context.guild.id)))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));
		if (await haveAccessToPool(context.guild.id, name)) return context.channel.send(await this.client.bulbutils.translate("banpool_leave_own", context.guild.id, {}));
		if (!(await isGuildInPool(context.guild.id, name))) return context.channel.send(await this.client.bulbutils.translate("banpool_leave_not_found", context.guild.id, {}));

		await leavePool(context.guild.id, name);

		await sendEventLog(
			this.client,
			await this.client.guilds.fetch(await getCreatorGuild(name)),
			"banpool",
			await this.client.bulbutils.translate("banpool_leave_log_og", context.guild.id, {
				user: context.user,
				name,
				guild: context.guild,
			}),
		);
		await sendEventLog(
			this.client,
			context.guild,
			"banpool",
			await this.client.bulbutils.translate("banpool_leave_log", context.guild.id, {
				user: context.user,
				name,
				guild: context.guild,
			}),
		);

		context.channel.send(await this.client.bulbutils.translate("banpool_leave_success", context.guild.id, {}));
	}
}

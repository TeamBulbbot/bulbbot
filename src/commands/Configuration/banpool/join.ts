import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Guild, Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { joinBanpool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "join",
			minArgs: 1,
			maxArgs: -1,
			argList: ["code:String"],
			usage: "<code>",
			clearance: 100,
			description: "Join a banpool.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const code: string = args[0];
		const invite = this.client.banpoolInvites.get(code);

		if (!(await hasBanpoolLog(context.guild?.id))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));
		if (!invite) return context.channel.send(await this.client.bulbutils.translate("banpool_join_unable_to_find", context.guild?.id, {}));
		if (invite.guild.id === context.guild?.id) return context.channel.send(await this.client.bulbutils.translate("banpool_join_own_guild", context.guild?.id, {}));
		if (!(await joinBanpool(invite, context.guild?.id))) return context.channel.send(await this.client.bulbutils.translate("banpool_join_error", context.guild?.id, {}));

		const poolguild: Guild = await this.client.guilds.fetch(invite.guild.id);

		await sendEventLog(
			this.client,
			poolguild,
			"banpool",
			await this.client.bulbutils.translate("banpool_join_log_og", context.guild?.id, {
				user: context.user,
				invite,
				guild: context.guild,
			}),
		);
		await sendEventLog(
			this.client,
			context.guild!,
			"banpool",
			await this.client.bulbutils.translate("banpool_join_log", context.guild?.id, {
				user: context.user,
				invite,
			}),
		);

		context.channel.send(await this.client.bulbutils.translate("banpool_join_success", context.guild?.id, {}));

		this.client.banpoolInvites.delete(invite.banpool.code);
	}
}

import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import parse from "parse-duration";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import TempbanManager from "../../utils/managers/TempbanManager";
import moment from "moment";
import { BanType } from "../../utils/types/BanType";
import { setTimeout } from "safe-timers";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();
const { createTempBan, deleteTempBan, getLatestTempBan }: TempbanManager = new TempbanManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Temporarily bans the selected user from the server",
			category: "Moderation",
			aliases: ["tempyeet"],
			usage: "<member> [reason]",
			examples: ["tempban 123456789012345678 1h", "tempban 123456789012345678 1h rude user", "tempban @Wumpus#0000 1h rude user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | null = targetID ? <GuildMember>await context.guild?.members.fetch(targetID).catch(() => null) : null;
		const duration: number = <number>parse(args[1]);
		let reason: string = args.slice(2).join(" ");
		let infID: number;

		if (!target)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		if ((duration && duration <= <number>parse("0s")) || duration === null) return context.channel.send(await this.client.bulbutils.translate("duration_invalid_0s", context.guild?.id, {}));
		if (duration > <number>parse("1y")) return context.channel.send(await this.client.bulbutils.translate("duration_invalid_1y", context.guild?.id, {}));

		infID = await infractionsManager.tempban(
			this.client,
			<Guild>context.guild,
			target,
			<GuildMember>context.member,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.temp_ban", context.guild?.id, {}),
				moderator: context.author,
				target: target.user,
				reason,
				until: Date.now() + <number>parse(args[1]),
			}),
			reason,
			Date.now() + <number>parse(args[1]),
		);

		await createTempBan(target, reason, Date.now() + <number>parse(args[1]), context.guild!.id);
		const tempban: any = await getLatestTempBan(target, context.guild!.id);

		const timezone = this.client.bulbutils.timezones[await databaseManager.getTimezone(<Snowflake>context.guild?.id)];
		await context.channel.send(
			await this.client.bulbutils.translate("action_success_temp", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.temp_ban", context.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
				until: moment(Date.now() + <number>parse(args[1]))
					.tz(timezone)
					.format("MMM Do YYYY, h:mm:ssa z"),
			}),
		);

		const client: BulbBotClient = this.client;
		setTimeout(async function () {
			if ((await infractionsManager.isActive(<Snowflake>context.guild?.id, infID)) === false) return;
			await infractionsManager.setActive(<Snowflake>context.guild?.id, infID, false);

			infID = await infractionsManager.unban(
				client,
				<Guild>context.guild,
				BanType.TEMP,
				target.user,
				<GuildMember>context.guild?.me,
				await client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await client.bulbutils.translate("mod_action_types.auto_unban", context.guild?.id, {}),
					moderator: client.user,
					target: target.user,
					reason: "Automatic unban",
				}),
				"Automatic unban",
			);

			await deleteTempBan(tempban.id);
		}, duration);
	}
}

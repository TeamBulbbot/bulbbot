import BulbBotClient from "../../structures/BulbBotClient";
import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import parse from "parse-duration";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import TempbanManager from "../../utils/managers/TempbanManager";
import moment from "moment";
import { BanType } from "../../utils/types/BanType";
import { setTimeout } from "safe-timers";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();
const tempbanManager: TempbanManager = new TempbanManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans a user for a specified amount of time",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "member",
					description: "The user to ban",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "duration",
					description: "The amount of time to ban the user for",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "reason",
					description: "The reason for the ban",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			command_permissions: ["BAN_MEMBERS"],
			client_permissions: ["BAN_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let member = interaction.options.getMember("member");
		let infID: number | null;
		const duration = parse(interaction.options.getString("duration") as string);
		const reason = interaction.options.getString("reason", false) || (await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found_new.member", interaction.guild?.id, {}),
				ephemeral: true,
			});

		if (await this.client.bulbutils.resolveUserHandle(interaction, await this.client.bulbutils.checkUser(interaction, member), member.user)) return;

		if (duration <= parse("0s"))
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_0s", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (duration > parse("1y"))
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_1y", interaction.guild?.id, {}),
				ephemeral: true,
			});

		infID = await infractionsManager.tempban(
			this.client,
			interaction.guild as Guild,
			member,
			interaction.member as GuildMember,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.temp_ban", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: member.user,
				reason,
			}),
			reason,
			moment().add(duration, "ms").unix(),
		);

		if (infID === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.db_inf_id_null", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await tempbanManager.createTempBan(member, reason, moment().add(duration, "ms").unix(), interaction.guild?.id as Snowflake);
		const tempban: any = await tempbanManager.getLatestTempBan(member, interaction.guild?.id as Snowflake);

		await interaction.reply(
			await this.client.bulbutils.translate("action_success_temp", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.temp_ban", interaction.guild?.id, {}),
				target: member.user,
				reason,
				infraction_id: infID,
				until: moment().add(duration, "ms").unix(),
			}),
		);

		const client: BulbBotClient = this.client;
		setTimeout(async function () {
			if (!interaction.guild?.id || !interaction.guild.me || !client.user || (await infractionsManager.isActive(interaction.guild?.id as Snowflake, infID)) === false) return;
			await infractionsManager.setActive(interaction.guild?.id as Snowflake, infID, false);

			infID = await infractionsManager.unban(
				client,
				interaction.guild as Guild,
				BanType.TEMP,
				(member as GuildMember).user,
				interaction.guild?.me as GuildMember,
				await client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: await client.bulbutils.translate("mod_action_types.auto_unban", interaction.guild?.id, {}),
					moderator: client.user,
					target: (member as GuildMember).user,
					reason: "Automatic unban",
				}),
				"Automatic unban",
			);

			await tempbanManager.deleteTempBan(tempban.id);
		}, duration);
	}
}

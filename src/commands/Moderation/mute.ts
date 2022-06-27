import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import parse from "parse-duration";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import moment from "moment";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.ChatInput,
			description: "Mutes the selected user",
			options: [
				{
					name: "member",
					type: ApplicationCommandOptionType.User,
					description: "The member you want to mute",
					required: true,
				},
				{
					name: "duration",
					type: ApplicationCommandOptionType.String,
					description: "How long the member should be muted for",
					required: true,
				},
				{
					name: "reason",
					type: ApplicationCommandOptionType.String,
					description: "The reason behind the mute",
					required: false,
				},
			],
			command_permissions: ["MUTE_MEMBERS"],
			client_permissions: ["MUTE_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let member = interaction.options.getMember("member");
		const duration = parse(interaction.options.getString("duration") as string);
		let reason = interaction.options.getString("reason", false);

		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found_new.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});
		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (await this.client.bulbutils.resolveUserHandleFromInteraction(interaction, await this.client.bulbutils.checkUserFromInteraction(interaction, member), member.user)) return;
		if ((duration && duration <= parse("0s")) || duration === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_0s", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (duration > parse("28d"))
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_28d", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (member.communicationDisabledUntilTimestamp !== null && Date.now() < member.communicationDisabledUntilTimestamp)
			return interaction.reply({
				content: await this.client.bulbutils.translate("mute_already_muted", interaction.guild?.id, { target: member.user }),
				ephemeral: true,
			});

		const infID = await infractionsManager.mute(
			this.client,
			interaction.guild as Guild,
			member,
			interaction.member as GuildMember,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: member.user,
				reason,
			}),
			reason,
			Date.now() + duration,
		);

		if (infID === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.db_inf_id_null", interaction.guild?.id, {}),
				ephemeral: true,
			});

		return interaction.reply(
			await this.client.bulbutils.translate("action_success_temp", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
				target: member.user,
				reason,
				infraction_id: infID,
				until: moment(Date.now() + duration).unix(),
			}),
		);
	}
}

import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { MuteType } from "../../utils/types/MuteType";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class Unmute extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Unmutes the specified user.",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "member",
					type: ApplicationCommandOptionType.User,
					description: "The user to unmute.",
					required: true,
				},
				{
					name: "reason",
					type: ApplicationCommandOptionType.String,
					description: "The reason for unmuting the user.",
					required: false,
				},
			],
			command_permissions: ["MODERATE_MEMBERS"],
			client_permissions: ["MODERATE_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let member = interaction.options.getMember("member");
		let reason = interaction.options.getString("reason", false);

		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});
		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (await this.client.bulbutils.resolveUserHandle(interaction, await this.client.bulbutils.checkUser(interaction, member), member.user)) return;
		if (member.communicationDisabledUntilTimestamp === null || member.communicationDisabledUntilTimestamp < Date.now())
			return interaction.reply({
				content: await this.client.bulbutils.translate("mute_not_muted", interaction.guild?.id, { target: member.user }),
				ephemeral: true,
			});

		const infID = await infractionsManager.unmute(
			this.client,
			interaction.guild as Guild,
			MuteType.MANUAL,
			member,
			interaction.user,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unmute", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: member.user,
				reason: reason,
			}),
			reason,
		);

		return interaction.reply(
			await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unmute", interaction.guild?.id, {}),
				target: member.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

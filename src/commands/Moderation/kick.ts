import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionTypes, ApplicationCommandType } from "../../utils/types/ApplicationCommands";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.CHAT_INPUT,
			description: "Kicks the selected user from the server",
			options: [
				{
					name: "member",
					type: ApplicationCommandOptionTypes.USER,
					description: "The member you want to kick",
					required: true,
				},
				{
					name: "reason",
					type: ApplicationCommandOptionTypes.STRING,
					description: "The reason behind the kick",
					required: false,
				},
			],
			command_permissions: ["KICK_MEMBERS"],
			client_permissions: ["KICK_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let member = interaction.options.getMember("member");
		let reason = interaction.options.getString("reason", false);

		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found_new.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});
		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (await this.client.bulbutils.resolveUserHandleFromInteraction(interaction, await this.client.bulbutils.checkUserFromInteraction(interaction, member), member.user)) return;

		const infID = await infractionsManager.kick(
			this.client,
			interaction.guild as Guild,
			member,
			interaction.member as GuildMember,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.kick", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: member.user,
				reason,
			}),
			reason,
		);

		if (infID === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.kick_inf_id_null", interaction.guild?.id, {}),
				ephemeral: true,
			});

		return interaction.reply(
			await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.kick", interaction.guild?.id, {}),
				target: member.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

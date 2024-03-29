import { CommandInteraction, Guild, GuildMember } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class Undeafen extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Undeafens a member from a Voice Channel they're connected to",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "member",
					description: "The member to undeafen",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "reason",
					description: "The reason for the undeafen",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			command_permissions: ["DEAFEN_MEMBERS"],
			client_permissions: ["DEAFEN_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const member: GuildMember = interaction.options.getMember("member") as GuildMember;
		const reason: string = interaction.options.getString("reason") || (await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (await this.client.bulbutils.resolveUserHandle(interaction, await this.client.bulbutils.checkUser(interaction, member), member.user)) return;
		if (!member.voice.channel)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_in_voice", interaction.guild?.id, { target: member.user }),
				ephemeral: true,
			});
		if (!member.voice.serverDeaf)
			return interaction.reply({
				content: await this.client.bulbutils.translate("undeafen_not_deaf", interaction.guild?.id, { target: member.user }),
				ephemeral: true,
			});

		const infID = await infractionsManager.undeafen(
			this.client,
			interaction.guild as Guild,
			member,
			interaction.member as GuildMember,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.undeafen", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: member.user,
				reason,
			}),
			reason,
		);

		return interaction.reply(
			await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.undeafen", interaction.guild?.id, {}),
				target: member.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

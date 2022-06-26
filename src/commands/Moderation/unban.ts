import { CommandInteraction, Guild, GuildMember, User } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { BanType } from "../../utils/types/BanType";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Unbans a user from the server.",
			type: ApplicationCommandType.ChatInput,
			options: [
				{ name: "user", description: "The user to unban.", type: ApplicationCommandOptionType.User, required: true },
				{ name: "reason", description: "The reason for the unban.", type: ApplicationCommandOptionType.String, required: false },
			],
			client_permissions: ["BAN_MEMBERS"],
			command_permissions: ["BAN_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") as User;
		let reason = interaction.options.getString("reason", false);

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});

		const banList = await interaction.guild?.bans.fetch();
		const bannedUser = banList?.find((ban) => user.id === ban.user.id);

		if (!bannedUser)
			return interaction.reply({
				content: await this.client.bulbutils.translate("not_banned", interaction.guild?.id, { target: user }),
				ephemeral: true,
			});

		const infID = await infractionsManager.unban(
			this.client,
			interaction.guild as Guild,
			BanType.MANUAL,
			user,
			interaction.member as GuildMember,
			await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unban", interaction.guild?.id, {}),
				moderator: interaction.user,
				target: user,
				reason,
			}),
			reason,
		);

		return interaction.reply(
			await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unban", interaction.guild?.id, {}),
				target: user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

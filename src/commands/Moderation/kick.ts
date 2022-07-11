import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";
import { BanType } from "../../utils/types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.ChatInput,
			description: "Kicks the selected user from the server",
			options: [
				{
					name: "member",
					type: ApplicationCommandOptionType.User,
					description: "The member you want to kick",
					required: true,
				},
				{
					name: "clean",
					type: ApplicationCommandOptionType.Integer,
					description: "The amount of messages that should be deleted",
					required: false,
					choices: [
						{ name: "Previous Day", value: 1 },
						{ name: "Previous 2 Days", value: 2 },
						{ name: "Previous 3 Days", value: 3 },
						{ name: "Previous 4 Days", value: 4 },
						{ name: "Previous 5 Days", value: 5 },
						{ name: "Previous 6 Days", value: 6 },
						{ name: "Previous 7 Days", value: 7 },
					],
				},
				{
					name: "reason",
					type: ApplicationCommandOptionType.String,
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
		const days = interaction.options.getInteger("clean", false) ? (interaction.options.getInteger("clean", false) as number) : 0;
		let infID: number | null;

		if (!member)
			return interaction.reply({
				// TODO: Rename global_not_found_new to global_not_found once all commands are migrated
				content: await this.client.bulbutils.translate("global_not_found_new.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});
		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (await this.client.bulbutils.resolveUserHandle(interaction, await this.client.bulbutils.checkUser(interaction, member), member.user)) return;

		if (days > 0) {
			infID = await infractionsManager.ban(
				this.client,
				interaction.guild as Guild,
				BanType.SOFT,
				member.user,
				interaction.member as GuildMember,
				await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
					moderator: interaction.user,
					target: member.user,
					reason,
				}),
				reason,
				days,
			);
		} else {
			infID = await infractionsManager.kick(
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
		}

		if (infID === null)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_error.db_inf_id_null", interaction.guild?.id, {}),
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

import { CommandInteraction, Guild, GuildMember, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { APIGuildMember, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class Nickname extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Change the nickname of a user.",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "member",
					description: "The member to change the nickname of.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "nickname",
					description: "The new nickname of the user.",
					type: ApplicationCommandOptionType.String,
					required: false,
					max_length: 32,
				},
				{
					name: "reason",
					description: "The reason for changing the nickname.",
					type: ApplicationCommandOptionType.String,
					required: false,
				},
			],
			command_permissions: ["MANAGE_NICKNAMES"],
			client_permissions: ["MANAGE_NICKNAMES"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let user = interaction.options.getMember("member") as GuildMember | APIGuildMember;
		const nickname = interaction.options.getString("nickname", false) || "";
		const reason = interaction.options.getString("reason", false) || (await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		if (user && !(user instanceof GuildMember)) user = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;
		if (!user)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found_new.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!nickname && !user.nickname)
			return interaction.reply({
				content: await this.client.bulbutils.translate("nickname_no_nickname", interaction.guild?.id, { target: user.user }),
				ephemeral: true,
			});
		if (nickname === user.nickname)
			return interaction.reply({
				content: await this.client.bulbutils.translate("nickname_same_nickname", interaction.guild?.id, { target: user.user, nickname: user.nickname }),
				ephemeral: true,
			});

		const nickOld: string = user.nickname || user.user.username;
		let infID: number;

		try {
			infID = await infractionsManager.nickname(
				this.client,
				interaction.guild as Guild,
				user,
				interaction.member as GuildMember,
				await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: nickname ? "Nickname changed" : "Nickname removed",
					moderator: interaction.user,
					target: user.user,
					reason,
				}),
				reason,
				nickOld,
				nickname,
			);
		} catch (e: any) {
			console.error(e.stack);
			return interaction.reply({
				content: await this.client.bulbutils.translate("nickname_fail", interaction.guild?.id, { target: user.user }),
				ephemeral: true,
			});
		}

		return interaction.reply(
			await this.client.bulbutils.translate(nickname ? "nickname_success" : "nickname_remove_success", interaction.guild?.id, {
				target: user.user,
				nick_old: nickOld,
				nick_new: nickname,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

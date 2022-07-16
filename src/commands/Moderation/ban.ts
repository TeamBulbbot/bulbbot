import { ButtonInteraction, Collection, CommandInteraction, Guild, GuildMember, Interaction, MessageActionRow, MessageButton, User } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { resolveGuildMemberMoreSafe } from "../../utils/helpers";
import { APIGuildMember, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class Ban extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans the selected user from the server",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "user",
					type: ApplicationCommandOptionType.User,
					description: "The user that should be banned",
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
					description: "The reason behind the ban",
					required: false,
				},
			],
			command_permissions: ["BAN_MEMBERS"],
			client_permissions: ["BAN_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let user: GuildMember | User;
		let reason = interaction.options.getString("reason", false);
		let infID: number;
		let clean: number = interaction.options.getInteger("clean") ? (interaction.options.getInteger("clean") as number) : 0;

		if (interaction.options.getMember("user") !== null) user = resolveGuildMemberMoreSafe(interaction.options.getMember("user") as GuildMember | APIGuildMember);
		else user = interaction.options.getUser("user") as User;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});
		if (user instanceof User) clean = 0;
		if (user instanceof GuildMember) if (await this.client.bulbutils.resolveUserHandle(interaction, await this.client.bulbutils.checkUser(interaction, user), user.user)) return;

		// @ts-expect-error
		const banList: Collection<string, { user: User; reason: string }> | undefined = await interaction.guild?.bans.fetch();
		const bannedUser = banList?.find((u) => u.user.id === (user instanceof GuildMember ? user.user.id : user.id));

		if (bannedUser)
			return interaction.reply({
				content: await this.client.bulbutils.translate("already_banned", interaction.guild?.id, {
					target: bannedUser.user,
					reason: bannedUser.reason ? bannedUser.reason.split("Reason: ").pop() : await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
				}),
				ephemeral: true,
			});

		if (user instanceof GuildMember) {
			infID = await infractionsManager.ban(
				this.client,
				interaction.guild as Guild,
				clean > 0 ? BanType.CLEAN : BanType.NORMAL,
				user.user,
				interaction.member as GuildMember,
				await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
					moderator: interaction.user,
					target: user.user,
					reason,
				}),
				reason,
				clean,
			);

			return interaction.reply(
				await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
					target: user.user,
					reason,
					infraction_id: infID,
				}),
			);
		} else {
			const row = new MessageActionRow().addComponents([
				new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
				new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
			]);

			await interaction.reply({
				content: await this.client.bulbutils.translate("ban_force_confirm", interaction.guild?.id, { target: user }),
				components: [row],
				ephemeral: true,
			});

			const filter = (i: Interaction) => interaction.user.id === i.user.id;
			const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 10000, max: 1, componentType: "BUTTON" });

			collector?.on("collect", async (i: ButtonInteraction) => {
				if (i.customId === "confirm") {
					collector.stop("clicked");

					infID = await infractionsManager.ban(
						this.client,
						interaction.guild as Guild,
						BanType.FORCE,
						user as User,
						interaction.member as GuildMember,
						await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.force_ban", interaction.guild?.id, {}),
							moderator: interaction.user,
							target: user as User,
							reason,
						}),
						reason as string,
						0,
					);

					await i.reply({
						content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
							target: user as User,
							reason,
							infraction_id: infID,
						}),
						components: [],
					});
					await interaction.editReply({
						content: await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}),
						components: [],
					});
					return;
				} else {
					collector.stop("clicked");
					await interaction.editReply({
						content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}),
						components: [],
					});
					return;
				}
			});

			collector?.on("end", async (i: ButtonInteraction, reason: string) => {
				if (reason !== "time") return;

				await interaction.editReply({
					content: await this.client.bulbutils.translate("global_execution_cancel", interaction.guild?.id, {}),
					components: [],
				});
				return;
			});
		}
	}
}

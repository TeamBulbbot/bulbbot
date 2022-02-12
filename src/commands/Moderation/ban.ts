import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { ButtonInteraction, Collection, Guild, GuildMember, Message, MessageActionRow, MessageButton, Snowflake, User } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans or forcebans a user from the server",
			category: "Moderation",
			aliases: ["terminate", "yeet"],
			usage: "<user> [reason]",
			examples: ["ban 123456789012345678", "ban 123456789012345678 rude user", "ban @Wumpus#0000 rude user"],
			argList: ["user:User", "reason:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: any = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		let reason: string = args.slice(1).join(" ");
		let notInGuild: boolean = !target;
		let infID: number = 0;

		if (!notInGuild) {
			if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;
		}

		//Fetches the ban list
		//@ts-ignore
		const banList: Collection<string, { user: User; reason: string }> | undefined = await context.guild?.bans.fetch();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		//If the user is already banned return with a context
		if (bannedUser) {
			await context.channel.send(
				await this.client.bulbutils.translate("already_banned", context.guild?.id, {
					target: bannedUser.user,
					reason: bannedUser.reason ? bannedUser.reason.split("Reason: ").pop() : await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {}),
				}),
			);
			return;
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		if (!target) target = await this.client.bulbfetch.getUser(targetID);
		if (!target)
			return await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_expected: "user:User",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		//If the user is not in the guild force ban
		if (notInGuild) {
			const row = new MessageActionRow().addComponents([
				new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
				new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
			]);

			const confirmMsg = await context.channel.send({
				content: await this.client.bulbutils.translate("ban_force_confirm", context.guild?.id, { target }),
				components: [row],
			});

			const collector = confirmMsg.createMessageComponentCollector({ time: 30000 });

			collector.on("collect", async (interaction: ButtonInteraction) => {
				if (interaction.user.id !== context.author.id) {
					return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });
				}

				if (interaction.customId === "confirm") {
					collector.stop("clicked");

					infID = await infractionsManager.ban(
						this.client,
						<Guild>context.guild,
						BanType.FORCE,
						<User>target,
						<GuildMember>context.member,
						await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.force_ban", context.guild?.id, {}),
							moderator: context.author,
							target,
							reason,
						}),
						reason,
					);

					return await interaction.update({
						content: await this.client.bulbutils.translate("action_success", context.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
							target,
							reason,
							infraction_id: infID,
						}),
						components: [],
					});
				} else {
					collector.stop("clicked");
					return interaction.update({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
				}
			});

			collector.on("end", async (interaction: ButtonInteraction, reason: string) => {
				if (reason !== "time") return;

				await confirmMsg.edit({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
				return;
			});
		} else {
			//Else execute a normal ban
			target = target.user;
			infID = await infractionsManager.ban(
				this.client,
				<Guild>context.guild,
				BanType.NORMAL,
				target,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
					moderator: context.author,
					target,
					reason,
				}),
				reason,
			);

			await context.channel.send(
				await this.client.bulbutils.translate("action_success", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
					target,
					reason,
					infraction_id: infID,
				}),
			);
		}
	}
}

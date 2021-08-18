import Command from "../../structures/Command";
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
			description: "Bans or forcebans a user from the guild",
			category: "Moderation",
			aliases: ["terminate", "yeet"],
			usage: "<user> [reason]",
			examples: ["ban 123456789012345678", "ban 123456789012345678 rude user", "ban @Wumpus#0000 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: any = message.guild?.members.cache.get(targetID);
		let reason: string = args.slice(1).join(" ");
		let notInGuild: boolean = !target;
		let infID: number = 0;

		if (!notInGuild) {
			if (await this.client.bulbutils.resolveUserHandle(message, this.client.bulbutils.checkUser(message, target), target.user)) return;
		}

		//Fetches the ban list
		//@ts-ignore
		const banList: Collection<string, { user: User; reason: string }> | undefined = await message.guild?.bans.fetch();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		//If the user is already banned return with a message
		if (bannedUser) {
			await message.channel.send(
				await this.client.bulbutils.translate("already_banned", message.guild?.id, {
					target: bannedUser.user,
					reason: bannedUser.reason.split("Reason: ").pop(),
				}),
			);
			return;
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});
		if (!target) {
			try {
				target = await this.client.users.fetch(targetID);
			} catch (error) {
				await message.channel.send(
					await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
						arg_expected: "user:User",
						arg_provided: args[0],
						usage: this.usage,
					}),
				);
				return;
			}
		}

		//If the user is not in the guild force ban
		if (notInGuild) {
			const row = new MessageActionRow().addComponents([
				new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
				new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
			]);

			const confirmMsg = await message.channel.send({
				content: await this.client.bulbutils.translate("ban_force_confirm", message.guild?.id, { target }),
				components: [row],
			});

			const filter = (i: ButtonInteraction) => i.user.id === message.author.id;
			let interaction: ButtonInteraction;

			try {
				interaction = await confirmMsg.awaitMessageComponent({ filter, time: 15000 });
			} catch (_) {
				await confirmMsg.delete();
				return await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id, {}));
			}

			if (interaction.customId === "confirm") {
				await confirmMsg.delete();
				infID = await infractionsManager.ban(
					this.client,
					<Guild>message.guild,
					BanType.FORCE,
					<User>target,
					<GuildMember>message.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.force_ban", message.guild?.id, {}),
						moderator: message.author,
						target,
						reason,
					}),
					reason,
				);
			} else {
				await confirmMsg.delete();
				return await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id, {}));
			}
		} else {
			//Else execute a normal ban
			target = target.user;
			infID = await infractionsManager.ban(
				this.client,
				<Guild>message.guild,
				BanType.NORMAL,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
					moderator: message.author,
					target,
					reason,
				}),
				reason,
			);
		}

		//Sends the response message
		await message.channel.send(
			await this.client.bulbutils.translate("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
				target,
				reason,
				infraction_id: infID,
			}),
		);
	}
}

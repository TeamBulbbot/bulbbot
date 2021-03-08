const Command = require("../../structures/Command");
const { TempBan, ForceBan, UnbanTemp } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");
const utils = new (require("../../utils/BulbBotUtils"))();
const { TempbanCreate, TempbanDelete } = require("../../utils/moderation/temp");

const parse = require("parse-duration");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Temporarily bans or forcebans a user from the guild",
			category: "Moderation",
			aliases: ["tempterminate", "tempyeet"],
			usage: "!tempban <user> <duration> [reason]",
			examples: ["tempban 190160914765316096 30m", "tempban 190160914765316096 6h rude user", "tempban @mrphilip#0001 24h rude user"],
			argList: ["user:User", "duration:Duration"],
			minArgs: 2,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		let target = message.guild.member(targetId);
		let reason = args.slice(2).join(" ");
		let duration = parse(args[1]);
		let notInGuild = !target;
		let infId = null;
		let tempbanId;

		if (await this.client.bulbutils.ResolveUserHandle(message, await this.client.bulbutils.CheckUser(message, target), target.user)) return

		const banList = await message.guild.fetchBans();
		const bannedUser = banList.find(user => user.user.id === targetId);

		if (duration < parse("0s") || duration === null) return message.channel.send(await this.client.bulbutils.translate("tempban_invalid_0s"));
		if (duration > parse("1y")) return message.channel.send(await this.client.bulbutils.translate("tempban_invalid_1y"));

		if (bannedUser) {
			return message.channel.send(
				await this.client.bulbutils.translate("already_banned", {
					target_tag: bannedUser.user.tag,
					target_id: bannedUser.user.id,
					reason: bannedUser.reason,
				}),
			);
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason");
		if (!target) {
			try {
				target = await this.client.users.fetch(targetId);
			} catch (error) {
				return message.channel.send(await this.client.bulbutils.translate("global_user_not_found"));
			}
		}

		if (notInGuild) {
			infId = await ForceBan(
				this.client,
				message.guild,
				target,
				message.author,
				await this.client.bulbutils.translate("global_mod_action_log", {
					action: "Temp-banned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);
		} else {
			if (!target.bannable) {
				return message.channel.send(
					await this.client.bulbutils.translate("ban_fail", {
						target_tag: target.user.tag,
						target_id: target.user.id,
					}),
				);
			}

			target = target.user;
			infId = await TempBan(
				this.client,
				message.guild,
				target,
				message.author,
				await this.client.bulbutils.translate("global_mod_action_log", {
					action: "Temp-banned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
					until: Date.now() + parse(args[1]),
				}),
				reason,
				Date.now() + parse(args[1]),
			);
		}

		tempbanId = await TempbanCreate(message.guild.id, target.tag, target.id, reason, Date.now() + parse(args[1]));

		message.channel.send(
			await this.client.bulbutils.translate("ban_success", {
				target_tag: target.tag,
				target_id: target.id,
				reason,
				infractionId: infId,
			}),
		);

		const client = this.client;
		setTimeout(async function () {
			infId = await UnbanTemp(
				client,
				message.guild,
				target,
				client.user,
				utils.translate("global_mod_action_log", {
					action: "Auto-unbanned",
					moderator_tag: client.user.tag,
					moderator_id: client.user.id,
					target_tag: target.tag,
					target_id: target.id,
					reason: "Automatic unban",
				}),
				"Automatic unban",
			);

			TempbanDelete(tempbanId);
		}, duration);
	}
};

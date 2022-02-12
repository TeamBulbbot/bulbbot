import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import { Invite, Message, User } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import AutoModPart, { AutoModListPart } from "../../../../utils/types/AutoModPart";
import BulbBotClient from "../../../../structures/BulbBotClient";
import { NonDigits } from "../../../../utils/Regex";
import imageHash from "imghash";
import axios from "axios";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "add",
			clearance: 75,
			minArgs: 2,
			maxArgs: -1,
			usage: "<part> <item> [items...]",
			argList: ["part:string", "item:string"],
			description: "Adds items to the specified part of the automod list.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const partArg: string = args[0];
		let items: (string | undefined)[] = args.slice(1);

		const partexec = /^(website|invite|word|avatars)s?$|^(?:words?_?)?(token)s?$|^(ignore)d?_?(channel|user|role)s?$/.exec(partArg.toLowerCase());
		if (!partexec)
			return context.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", context.guild!.id, {
					argument: partArg,
					arg_expected: this.argList[0],
					argument_list: "`website`, `invites`, `words`, `words_token`, `ignore_channels`, `ignore_roles`, `avatars` or `ignore_users`",
				}),
			);
		const partString = partexec[1] ?? partexec[2] ?? `${partexec[3]}_${partexec[4]}`;

		if (partString === "invite") {
			items = await Promise.all(
				items.map(async item => {
					let invite: Invite;
					try {
						invite = await this.client.fetchInvite(item!);
					} catch (_) {
						return;
					}

					return invite.code;
				}),
			);
			items = items.filter(n => n);
		}

		if (!items.length) return context.channel.send(await this.client.bulbutils.translate("global_error.automod_items_length_undefined", context.guild!.id, {}));

		const part: AutoModListPart = AutoModPart[partString];
		if (partString.includes("_")) items = items.map(item => item!.replace(NonDigits, ""));

		if (partString === "avatars") {
			const hash = await Promise.all(
				items.map(async item => {
					const user: User | undefined = await this.client.bulbfetch.getUser(item!.replace(NonDigits, ""));
					if (user) {
						const buffer = await axios.get(user?.displayAvatarURL()!, {
							responseType: "arraybuffer",
						});
						const avatarHash = await imageHash.hash(buffer.data, 8);
						return avatarHash;
					} else {
						try {
							const buffer = await axios.get(item!, {
								responseType: "arraybuffer",
							});
							const avatarHash = await imageHash.hash(buffer.data, 8);
							return avatarHash;
						} catch (error) {}
					}
				}),
			);
			items = hash.filter(h => h);
		}

		const result = await databaseManager.automodAppend(context.guild!.id, part, items);

		if (!result.added.length) return context.channel.send(await this.client.bulbutils.translate("automod_already_in_database", context.guild!.id, { item: items.join("`, `") }));
		await context.channel.send(
			await this.client.bulbutils.translate("automod_add_success", context.guild!.id, {
				category: partArg,
				item: result.added.join("`, `"),
			}),
		);
	}
}

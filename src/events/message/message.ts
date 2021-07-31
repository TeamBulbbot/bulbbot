import Event from "../../structures/Event";
import { BitField, GuildMember, Message, PermissionString } from "discord.js";
import Command from "../../structures/Command";
import DMUtils from "../../utils/DMUtils";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";
import LoggingManager from "../../utils/managers/LoggingManager";
import SubCommand from "../../structures/SubCommand";
import AutoMod from "../../utils/AutoMod";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<any> {
		// checks if the user is in the blacklist
		if (this.client.blacklist.get(message.author.id) !== undefined) return;

		if (message.channel.type === "dm") return DMUtils(this.client, message);
		if (!message.guild || message.author.bot) return;

		// checks if the guild is in the blacklist
		if (this.client.blacklist.get(message.guild.id)) return;

		const mentionRegex: RegExp = RegExp(`^<@!?${this.client.user!.id}>`);
		let guildCfg = await databaseManager.getConfig(message.guild.id);

		if ((guildCfg === undefined || guildCfg.prefix === undefined) && (message.content.startsWith(Config.prefix) || mentionRegex.test(message.content))) {
			await databaseManager.deleteGuild(message.guild.id);
			await databaseManager.createGuild(message.guild);
			if (!(guildCfg = await databaseManager.getConfig(message.guild.id)))
				return message.channel.send("Please remove and re-add the bot to the server https://bulbbot.mrphilip.xyz/invite, there has been an error with the configuration of the guild");
		}

		const prefix = guildCfg.prefix;
		const premiumGuild = guildCfg.premiumGuild;

		this.client.prefix = prefix;

		const clearance: number = await clearanceManager.getUserClearance(message);

		if (clearance < 25) {
			await AutoMod(this.client, message);
		}

		if (!message.content.startsWith(this.client.prefix) && !message.content.match(mentionRegex)) return;
		if (message.content.match(mentionRegex) && message.content.replace(mentionRegex, "").trim().length === 0)
			return message.channel.send(`My prefix for **${message.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (message.content.match(mentionRegex)) message.content = `!${message.content.replace(mentionRegex, "").trim()}`;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
		const command: Command | undefined = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase())!);

		if (!command) return;
		if (command.premium && !premiumGuild) return message.channel.send(await this.client.bulbutils.translate("premium_message", message.guild.id));

		if(!message.guild.me) await message.guild.members.fetch(this.client.user!.id);
		if(!message.guild.me) return; // Shouldn't be possible to return here. Narrows the type

		const commandOverride: Record<string, any> | undefined = await clearanceManager.getCommandOverride(message.guild.id, command.name);
		if (commandOverride !== undefined) {
			if (!commandOverride["enabled"]) return;
			if (commandOverride["clearanceLevel"] > clearance) {
				return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
					message.delete({ timeout: 5000 });
					msg.delete({ timeout: 5000 });
				});
			}
		}

		this.client.userClearance = clearance;
		if (command.clearance > clearance && !commandOverride) {
			return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
				message.delete({ timeout: 5000 });
				msg.delete({ timeout: 5000 });
			});
		}

		const userPermCheck: BitField<PermissionString> = command.userPerms;
		if (userPermCheck && (command.clearance <= clearance)) {
			const userMember: GuildMember = message.member!;
			const missing: boolean = !(userMember.permissions.has(userPermCheck) && userMember.permissionsIn(message.channel).has(userPermCheck)); // !x || !y === !(x && y)

			if (missing) {
				return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
					message.delete({ timeout: 5000 });
					msg.delete({ timeout: 5000 });
				});
			}
		}

		const clientPermCheck: BitField<PermissionString> = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;;
		if (clientPermCheck) {
			let missing: PermissionString[] = message.guild.me.permissions.missing(clientPermCheck);
			if (!missing.length) missing = message.guild.me.permissionsIn(message.channel).missing(clientPermCheck);

			if (missing.length)
				return message.channel.send(
					await this.client.bulbutils.translate("global_missing_permission_bot", message.guild.id, {
						missing: missing.map(perm => `\`${perm}\``).join(", "),
					}),
				);
		}

		if (command.subDevOnly) if (!Config.developers.includes(message.author.id) && !Config.subDevelopers.includes(message.author.id)) return;
		if (command.devOnly) if (!Config.developers.includes(message.author.id)) return;

		if (command.maxArgs < args.length && command.maxArgs !== -1) {
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_unexpected", message.guild.id, {
					arg: args[command.maxArgs],
					arg_expected: command.maxArgs,
					arg_provided: args.length,
					usage: command.usage.replace("!", prefix),
				}),
			);
		}

		if (command.minArgs > args.length) {
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: command.argList[args.length],
					arg_expected: command.minArgs,
					arg_provided: args.length,
					usage: command.usage.replace("!", prefix),
				}),
			);
		}

		let used: string = `${prefix}${command.name}`;
		args.forEach(arg => (used += ` ${arg}`));
		await loggingManager.sendCommandLog(this.client, message.guild, message.author, message.channel.id, used);

		let sCmd: SubCommand;
		if (command.subCommands) {
			for (const subCommand of command.subCommands) {
				// @ts-ignore
				sCmd = new subCommand(this.client, command, args[0]);
				if (args[0].toLowerCase() === sCmd.name || sCmd.aliases.includes(args[0])) {
					if (sCmd.maxArgs < args.length - 1 && sCmd.maxArgs !== -1) {
						return message.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected", message.guild.id, {
								arg: args[sCmd.maxArgs + 1],
								arg_expected: sCmd.maxArgs,
								arg_provided: args.length - 1,
								usage: sCmd.usage.replace("!", prefix),
							}),
						);
					}
					if (sCmd.minArgs > args.length - 1) {
						return message.channel.send(
							await this.client.bulbutils.translate("event_message_args_missing", message.guild.id, {
								arg: sCmd.argList[args.length - 1],
								arg_expected: sCmd.minArgs,
								arg_provided: args.length - 1,
								usage: sCmd.usage.replace("!", prefix),
							}),
						);
					}

					return await sCmd.run(message, command, args);
				}
			}
		}

		await command.run(message, args);
	}
}

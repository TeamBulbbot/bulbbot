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
import ResolveCommandOptions from "src/utils/types/ResolveCommandOptions";

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
		if (message.content.match(mentionRegex)) message.content = `${this.client.prefix}${message.content.replace(mentionRegex, "").trim()}`;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
		let command: Command | undefined = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase())!);

		if (!command) return;

		const options: ResolveCommandOptions = {
			message,
			baseCommand: command,
			args,
			clearance,
			premiumGuild,
			isDev: Config.developers.includes(message.author.id),
			isSubDev: Config.developers.includes(message.author.id) || Config.subDevelopers.includes(message.author.id),
		};

		const resolved = await this.resolveCommand(options);
		if(!resolved) return;
		if(resolved instanceof Message) return resolved;
		command = resolved;

		let used: string = `${prefix}${command.name}`;
		options.args.forEach(arg => (used += ` ${arg}`));
		command.devOnly || command.subDevOnly ? null : await loggingManager.sendCommandLog(this.client, message.guild, message.author, message.channel.id, used);

		await command.run(message, options.args);
	}

	public async resolveCommand(options: ResolveCommandOptions): Promise<Command | Message | undefined> {
		const {message, baseCommand, args, clearance, premiumGuild, isDev, isSubDev} = options;
		let command = baseCommand;
		if (!message.guild?.me) await message.guild?.members.fetch(this.client.user!.id);
		if (!message.guild?.me) return; // Shouldn't be possible to return here. Narrows the type
		let currCommand: Command;
		let i: number;
		for(i = 0;; ++i) {
			const commandArgs = args.slice(i);
			currCommand = command;
			if (command.premium && !premiumGuild) return message.channel.send(await this.client.bulbutils.translate("premium_message", message.guild.id));

			const commandOverride: Record<string, any> | undefined = await clearanceManager.getCommandOverride(message.guild.id, command.name);
			if (commandOverride !== undefined) {
				if (!commandOverride["enabled"]) return;
				if (commandOverride["clearanceLevel"] > clearance) {
					return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
						setImmediate(_=>{
							message.delete({ timeout: 5000 });
							msg.delete({ timeout: 5000 });
						});
						return msg;
					});
				}
			}

			this.client.userClearance = clearance;
			if (command.clearance > clearance && !commandOverride) {
				return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
					setImmediate(_=>{
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
					return msg;
				});
			}

			const userPermCheck: BitField<PermissionString> = command.userPerms;
			if (userPermCheck && command.clearance <= clearance) {
				const userMember: GuildMember = message.member!;
				const missing: boolean = !(userMember.permissions.has(userPermCheck) && userMember.permissionsIn(message.channel).has(userPermCheck)); // !x || !y === !(x && y)

				if (missing) {
					return message.channel.send(await this.client.bulbutils.translate("global_missing_permission", message.guild.id)).then(msg => {
						setImmediate(_=>{
							message.delete({ timeout: 5000 });
							msg.delete({ timeout: 5000 });
						});
						return msg;
					});
				}
			}

			const clientPermCheck: BitField<PermissionString> = command.clientPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms;
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

			if (command.subDevOnly) if (!isSubDev) return;
			if (command.devOnly) if (!isDev) return;

			if (command.maxArgs < commandArgs.length && command.maxArgs !== -1) {
				return message.channel.send(
					await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild.id, {
						argument: commandArgs[command.maxArgs],
						arg_expected: command.maxArgs,
						arg_provided: commandArgs.length,
						usage: `${this.client.prefix}${command.usage}`,
					}),
				);
			}

			if (command.minArgs > commandArgs.length) {
				return message.channel.send(
					await this.client.bulbutils.translateNew("event_message_args_missing", message.guild.id, {
						argument: command.argList[commandArgs.length],
						arg_expected: command.minArgs,
						usage: `\`${this.client.prefix}${command.usage}\``,
					}),
				);
			}

			if(!command.subCommands.length) break;
			if(i >= args.length) break;
			command = await this.resolveSubcommand(command, commandArgs);
			if(command === currCommand) break;
		}
		options.args = args.slice(i);
		return command;
	}

	private async resolveSubcommand(command: Command, args: string[]): Promise<Command> {
		let sCmd: SubCommand;
		for (const subCommand of command.subCommands) {
			// @ts-ignore
			sCmd = new subCommand(this.client, command);
			if (args[0].toLowerCase() === sCmd.name || sCmd.aliases.includes(args[0].toLowerCase()))
				return sCmd;
		}

		return command;
	}
}

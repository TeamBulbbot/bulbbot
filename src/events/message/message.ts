import Event from "../../structures/Event";
import { Message, User } from "discord.js";
import Command from "../../structures/Command";
import DMUtils from "../../utils/DMUtils";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../structures/Config";
import LoggingManager from "../../utils/managers/LoggingManager";
import { SubCommand } from "../../structures/SubCommand";
import AutoMod from "../../utils/AutoMod"

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
		if (message.channel.type === "dm") return DMUtils(this.client, message);
		if (!message.guild || message.author.bot) return;

		// @ts-ignore
		const { prefix, premiumGuild } = await databaseManager.getConfig(message.guild.id);

		if (prefix === undefined && message.content.startsWith(Config.prefix))
			return message.channel.send(
				"Please remove and re-add the bot to the server https://bulbbot.mrphilip.xyz/invite, there has been an error with the configuration of the guild",
			);

		this.client.prefix = prefix;

		const mentionRegex: RegExp = RegExp(`^<@!?${this.client.user.id}>`);

		const clearance: number = await clearanceManager.getUserClearance(message);

		if (clearance < 25) {
			await AutoMod(this.client, message)
		}

		if (!message.content.startsWith(this.client.prefix) && !message.content.match(mentionRegex)) return;
		if (message.content.match(mentionRegex) && message.content.replace(mentionRegex, "").trim().length === 0)
			return message.channel.send(`My prefix for **${message.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (message.content.match(mentionRegex)) message.content = `!${message.content.replace(mentionRegex, "").trim()}`;

		const [cmd, ...args] = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
		const command: Command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!command) return;
		if (command.premium && !premiumGuild) return message.channel.send(await this.client.bulbutils.translate("premium_message", message.guild.id));

		const commandOverride: object = <object>await clearanceManager.getCommandOverride(message.guild.id, command.name);
		const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
		const missing = message.guild.me?.permissionsIn(message.channel).has(userPermCheck);

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

		if (userPermCheck && !(clearance < command.clearance)) {
			// @ts-ignore
			if (missing?.length) {
				return message.channel
					.send(await this.client.bulbutils.translate("global_missing_permission_bot", message.guild.id, { missing }))
					.then(msg => {
						message.delete({ timeout: 5000 });
						msg.delete({ timeout: 5000 });
					});
			}
		}

		const clientPermCheck = command.clientPerms;
		if (clientPermCheck) {
			let missing = !message.guild.me?.hasPermission(clientPermCheck);
			//if (!missing) missing = !message.guild.me.permissionsIn(message.channel).has(clientPermCheck);

			if (missing)
				return message.channel.send(
					await this.client.bulbutils.translate("global_missing_permission_bot", message.guild.id, {
						missing: clientPermCheck.toArray().map(perm => `\`${perm}\` `),
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
		await loggingManager.sendCommandLog(this.client, message.guild, <User>message.member?.user, message.channel.id, used);

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
								arg_provided: args.length -1,
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
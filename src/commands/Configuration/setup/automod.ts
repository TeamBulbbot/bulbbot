import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { CollectorFilter, User } from "discord.js";
import AutoModSetup from "../../../utils/types/AutoModSetup";
import AutoModPart from "../../../utils/types/AutoModPart";
import Setup, { PromptOptions } from "../setup";
import AutoModConfiguration from "../../../utils/types/AutoModConfiguration";
import { NonDigits } from "../../../utils/Regex";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "automod",
			clearance: 75,
			maxArgs: 0,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<AutoModSetup | null> {
		if (!args.length) {
			await context.channel.send("Welcome to **Bulbbot AutoMod Setup**.");
			await this.client.bulbutils.sleep(1000);
		} else {
			this.client.prefix = args[0]; // use updated prefix when called by full Setup command
		}
		const autoModSetup: AutoModSetup = {};
		const amdb: AutoModConfiguration = await databaseManager.getAutoModConfig(context.guild!.id);
		const apply = !args.length ? async (setup: AutoModSetup) => (await this.applySetup(context, setup), null) : async (setup: AutoModSetup) => setup;
		let result: string | number | null;

		if (null === (result = await this.prompt(context, AutoModPart.message, "Should I limit how fast users can send messages?", "Yes", autoModSetup))) return await apply(autoModSetup);
		if (result.toLowerCase() === "no") {
			autoModSetup.limitMessages = 0;
		} else {
			const limitMessagesCandidate = amdb.limitMessages || 20; // TODO: fine tune default suggestion
			if (null === (result = await this.prompt(context, AutoModPart.limit, "How many messages in a short time is OK?", limitMessagesCandidate, autoModSetup))) return await apply(autoModSetup);
			autoModSetup.limitMessages = +result;

			const timeoutMessagesCandidate = amdb.timeoutMessages;
			if (null === (result = await this.prompt(context, AutoModPart.timeout, "How long should this time be?", timeoutMessagesCandidate, autoModSetup))) return await apply(autoModSetup);
			autoModSetup.timeoutMessages = +result;

			const punishmentMessagesCandidate = amdb.timeoutMessages;
			if (null === (result = await this.prompt(context, AutoModPart.punishment, "What should I do when a user breaks this limit?", punishmentMessagesCandidate, autoModSetup)))
				return await apply(autoModSetup);
			autoModSetup.punishmentMessages = /^(LOG|WARN|KICK|BAN)$/.exec(context.content.toUpperCase())![1];
		}

		if (null === (result = await this.prompt(context, AutoModPart.mention, "Should I limit how fast users can send mentions?", "Yes", autoModSetup))) return await apply(autoModSetup);
		if (result.toLowerCase() === "no") {
			autoModSetup.limitMentions = 0;
		} else {
			const limitMentionsCandidate = amdb.limitMentions || 20; // TODO: fine tune default suggestion
			if (null === (result = await this.prompt(context, AutoModPart.limit, "How many messages in a short time is OK?", limitMentionsCandidate, autoModSetup))) return await apply(autoModSetup);
			autoModSetup.limitMentions = +result;

			const timeoutMentionsCandidate = amdb.timeoutMentions;
			if (null === (result = await this.prompt(context, AutoModPart.timeout, "How long should this time be?", timeoutMentionsCandidate, autoModSetup))) return await apply(autoModSetup);
			autoModSetup.timeoutMentions = +result;

			const punishmentMentionsCandidate = amdb.timeoutMentions;
			if (null === (result = await this.prompt(context, AutoModPart.punishment, "What should I do when a user breaks this limit?", punishmentMentionsCandidate, autoModSetup)))
				return await apply(autoModSetup);
			autoModSetup.punishmentMentions = /^(LOG|WARN|KICK|BAN)$/.exec(context.content.toUpperCase())![1];
		}

		if (null === (result = await this.prompt(context, AutoModPart.word, "Would you like to ", "Yes", autoModSetup))) return await apply(autoModSetup);
		if (result.toLowerCase() === "no") {
			autoModSetup.limitMentions = 0;
		} else {
		}

		if (!args.length) {
			await apply(autoModSetup);
		}
		return null;
	}

	// @ts-ignore
	private filter(part: AutoModPart, user: User): CollectorFilter {
		switch (part) {
			case AutoModPart.message:
			case AutoModPart.mention:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (/n(o(ne)?)?/.test(context.content.toLowerCase())) {
						context.content = "no";
					} else if (/y(es)?|enable/.test(context.content.toLowerCase())) {
						context.content = "yes";
					} else {
						await context.channel.send(await this.client.bulbutils.needsTranslation("`Yes` or `No`", context.guild?.id, {}));
						return false;
					}
					return true;
				});
			case AutoModPart.timeout:
			case AutoModPart.limit:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (!NonDigits.test(context.content) && Number.isSafeInteger(context.content)) return true;
					await context.channel.send(await this.client.bulbutils.needsTranslation("Argument must be a number"));
					return false;
				});
			case AutoModPart.punishment:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					const itemexec = /^(LOG|WARN|KICK|BAN)$/.exec(context.content.toUpperCase());
					if (!itemexec) {
						await context.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected", context.guild!.id, {
								argument: "punishment",
								arg_expected: "punishment:string",
								arg_provided: context.content,
								usage: "`LOG`, `WARN`, `KICK` or `BAN`",
							}),
						);
						return false;
					}

					return true;
				});
			case AutoModPart.word:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					return true;
				});
			case AutoModPart.token:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					return true;
				});
			case AutoModPart.invite:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					return true;
				});
			case AutoModPart.website:
				return (<Setup>this.parent)._filter(user, async (context: CommandContext): Promise<boolean> => {
					return true;
				});
			default:
				throw Error();
		}
	}

	private async prompt(context: CommandContext, part: AutoModPart, text: string, defaultOption: string | number, autoModSetup: AutoModSetup, options: PromptOptions = {}): Promise<string | null> {
		let maxtime = options.maxtime ?? 180000;
		if (maxtime < 1000) maxtime *= 60000; // Permit maxtime in minutes
		const partName: string = Object.getOwnPropertyNames(AutoModPart).find(n => AutoModPart[n] === part)!;
		const defaultText = options.defaultText ?? `\`${defaultOption}\``;
		await context.channel.send({ content: `${text} (${defaultText})`, allowedMentions: { parse: [] } });
		const response = (await context.channel.awaitMessages({ filter: this.filter(part, context.author), max: 1, time: maxtime })).first();
		if (!response) {
			await this.timedout(part, context);
			return null;
		}
		if (response.content === this.client.prefix) autoModSetup[partName] = defaultOption;

		// Should each prompt send a success/confirmation context? e.g. "Prefix set to `bulb!`"

		return response.content;
	}

	private async timedout(part: AutoModPart, context: CommandContext) {
		// TODO
		// THESE ARE PLACEHOLDERS
		// WE NEED ACTUAL STUFF HERE BEFORE WE SHIP
		// PLS
		// Perhaps we just accept default action on timeout, another option. Maybe circumstantial
		switch (part) {
			case AutoModPart.invite:
				await context.channel.send("AutoMod Setup invite timed out or something");
				break;
			case AutoModPart.mention:
				await context.channel.send("AutoMod Setup mention timed out or something");
				break;
			case AutoModPart.message:
				await context.channel.send("AutoMod Setup message timed out or something");
				break;
			case AutoModPart.token:
				await context.channel.send("AutoMod Setup token timed out or something");
				break;
			case AutoModPart.website:
				await context.channel.send("AutoMod Setup website timed out or something");
				break;
			case AutoModPart.word:
				await context.channel.send("AutoMod Setup word timed out or something");
				break;
		}
	}

	public async applySetup(context: CommandContext, guildSetup: AutoModSetup | undefined): Promise<void> {
		if (!guildSetup || guildSetup === {}) return;
	}
}

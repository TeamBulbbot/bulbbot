import SubCommand from "../../../structures/SubCommand";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { CollectorFilter, Message, User } from "discord.js";
import AutoModSetup from "../../../utils/types/AutoModSetup";
import AutoModPart from "../../../utils/types/AutoModPart";
import Setup, { PromptOptions } from "../setup";
import AutoModConfiguration from "../../../utils/types/AutoModConfiguration";
import { NonDigits } from "../../../utils/Regex";
// @ts-ignore
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "automod",
			clearance: 75,
			maxArgs: 0,
			usage: "!setup automod",
		});
	}

	public async run(message: Message, args: string[]): Promise<AutoModSetup | null> {
        if(!args.length) {
			await message.channel.send("Welcome to **Bulbbot AutoMod Setup**.");
			await this.client.bulbutils.sleep(1000);
        } else {
			this.client.prefix = args[0]; // use updated prefix when called by full Setup command
		}
		const autoModSetup: AutoModSetup = {};
		const amdb: AutoModConfiguration = await databaseManager.getAutoModConfig(message.guild!.id);
		const apply = !args.length ? async (setup: AutoModSetup) => (await this.applySetup(message, setup), null) : async (setup: AutoModSetup) => setup;
		let result: string | number | null;

		if(null === (result = await this.prompt(
			message,
			AutoModPart.message,
			"Should I limit how fast users can send messages?",
			"Yes",
			autoModSetup,
		))) return await apply(autoModSetup);
		if(result.toLowerCase() === "no") {
			autoModSetup.limitMessages = 0;
		} else {
			const limitMessagesCandidate = amdb.limitMessages || 20; // TODO: fine tune default suggestion
			if(null === (result = await this.prompt(
				message,
				AutoModPart.limit,
				"How many messages in a short time is OK?",
				limitMessagesCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.limitMessages = +result;

			const timeoutMessagesCandidate = amdb.timeoutMessages;
			if(null === (result = await this.prompt(
				message,
				AutoModPart.timeout,
				"How long should this time be?",
				timeoutMessagesCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.timeoutMessages = +result;

			const punishmentMessagesCandidate = amdb.timeoutMessages;
			if(null === (result = await this.prompt(
				message,
				AutoModPart.punishment,
				"What should I do when a user breaks this limit?",
				punishmentMessagesCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.punishmentMessages = /^(LOG|WARN|KICK|BAN)$/.exec(message.content.toUpperCase())![1];
		}

		if(null === (result = await this.prompt(
			message,
			AutoModPart.mention,
			"Should I limit how fast users can send mentions?",
			"Yes",
			autoModSetup,
		))) return await apply(autoModSetup);
		if(result.toLowerCase() === "no") {
			autoModSetup.limitMentions = 0;
		} else {
			const limitMentionsCandidate = amdb.limitMentions || 20; // TODO: fine tune default suggestion
			if(null === (result = await this.prompt(
				message,
				AutoModPart.limit,
				"How many messages in a short time is OK?",
				limitMentionsCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.limitMentions = +result;

			const timeoutMentionsCandidate = amdb.timeoutMentions;
			if(null === (result = await this.prompt(
				message,
				AutoModPart.timeout,
				"How long should this time be?",
				timeoutMentionsCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.timeoutMentions = +result;

			const punishmentMentionsCandidate = amdb.timeoutMentions;
			if(null === (result = await this.prompt(
				message,
				AutoModPart.punishment,
				"What should I do when a user breaks this limit?",
				punishmentMentionsCandidate,
				autoModSetup,
			))) return await apply(autoModSetup);
			autoModSetup.punishmentMentions = /^(LOG|WARN|KICK|BAN)$/.exec(message.content.toUpperCase())![1];
		}

		if(null === (result = await this.prompt(
			message,
			AutoModPart.word,
			"Would you like to ",
			"Yes",
			autoModSetup,
		))) return await apply(autoModSetup);
		if(result.toLowerCase() === "no") {
			autoModSetup.limitMentions = 0;
		} else {

		}


		if(!args.length) {
			await apply(autoModSetup);
		}
		return null;
    }

// @ts-ignore
	private filter(part: AutoModPart, user: User): CollectorFilter {
		switch(part) {
			case AutoModPart.message:
			case AutoModPart.mention:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					if (/n(o(ne)?)?/.test(message.content.toLowerCase())) {
						message.content = "no";
					} else if (/y(es)?|enable/.test(message.content.toLowerCase())) {
						message.content = "yes";
					} else {
						await message.channel.send(
							await this.client.bulbutils.needsTranslation("`Yes` or `No`", message.guild?.id, {

							}),
						);
						return false;
					}
					return true;
				});
			case AutoModPart.timeout:
			case AutoModPart.limit:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					if(!NonDigits.test(message.content) && Number.isSafeInteger(message.content)) return true;
					await message.channel.send(await this.client.bulbutils.needsTranslation("Argument must be a number"));
					return false;
				});
			case AutoModPart.punishment:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					const itemexec = /^(LOG|WARN|KICK|BAN)$/.exec(message.content.toUpperCase());
					if (!itemexec) {
						await message.channel.send(
							await this.client.bulbutils.translateNew("event_message_args_unexpected", message.guild!.id, {
								argument: "punishment",
								arg_expected: "punishment:string",
								arg_provided: message.content,
								usage: "`LOG`, `WARN`, `KICK` or `BAN`",
							}),
						);
						return false;
					}

					return true;
				});
			case AutoModPart.word:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					return true;
				});
			case AutoModPart.token:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					return true;
				});
			case AutoModPart.invite:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					return true;
				});
			case AutoModPart.website:
				return (<Setup>this.parent)._filter(user, async (message: Message): Promise<boolean> => {
					return true;
				});
			default: throw Error();
		}
	}

	private async prompt(message: Message, part: AutoModPart, text: string, defaultOption: string | number, autoModSetup: AutoModSetup, options: PromptOptions = {}): Promise<string | null> {
		let maxtime = options.maxtime ?? 180000;
		if (maxtime < 1000) maxtime *= 60000; // Permit maxtime in minutes
		const partName: string = Object.getOwnPropertyNames(AutoModPart).find(n => AutoModPart[n] === part)!;
		const defaultText = options.defaultText ?? `\`${defaultOption}\``;
		await message.channel.send(`${text} (${defaultText})`, {allowedMentions: {parse: []}});
		const response = (await message.channel.awaitMessages(this.filter(part, message.author), { max: 1, time: maxtime })).first();
		if (!response) {
			await this.timedout(part, message);
			return null;
		}
		if (response.content === this.client.prefix) autoModSetup[partName] = defaultOption;

		// Should each prompt send a success/confirmation message? e.g. "Prefix set to `bulb!`"

		return response.content;
	}

	private async timedout(part: AutoModPart, message: Message) {
		// TODO
		// THESE ARE PLACEHOLDERS
		// WE NEED ACTUAL STUFF HERE BEFORE WE SHIP
		// PLS
		// Perhaps we just accept default action on timeout, another option. Maybe circumstantial
		switch (part) {
			case AutoModPart.invite:
				await message.channel.send("AutoMod Setup invite timed out or something");
				break;
			case AutoModPart.mention:
				await message.channel.send("AutoMod Setup mention timed out or something");
				break;
			case AutoModPart.message:
				await message.channel.send("AutoMod Setup message timed out or something");
				break;
			case AutoModPart.token:
				await message.channel.send("AutoMod Setup token timed out or something");
				break;
			case AutoModPart.website:
				await message.channel.send("AutoMod Setup website timed out or something");
				break;
			case AutoModPart.word:
				await message.channel.send("AutoMod Setup word timed out or something");
				break;
		}
	}

	public async applySetup(message: Message, guildSetup: AutoModSetup | undefined): Promise<void> {
		if(!guildSetup || guildSetup === {}) return;
	}
}

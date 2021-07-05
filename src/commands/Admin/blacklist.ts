import Command from "../../structures/Command";
import { Message } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Command {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			description: "Blacklists a user/guild from using the bot",
			category: "Admin",
			usage: "!blacklist <action> <type> <snowflake> [reason]",
			examples: ["blacklist add guild 742094927403679816 spamming commnads"],
			minArgs: 3,
			maxArgs: -1,
			argList: ["action:string", "type:string", "snowflake:snowflake", "reason:string"],
			devOnly: true,
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		switch (args[0].toLowerCase()) {
			case "add":
				let name: string | String;
				try {
					if (args[1] === "guild") name = (await this.client.guilds.fetch(args[2])).name;
					else name = (await this.client.users.fetch(args[2])).tag;
				} catch (error) {
					console.error(error);
					await message.channel.send(`\`${args[2]}\` is not a valid snowflake for the type **${args[1]}**`);
					return;
				}

				if (!args[3]) args[3] = "No reason";

				await databaseManager.addBlacklist(args[1] === "guild" ? true : false, name, args[2], args.slice(3).join(" "), message.author.id);
				this.client.blacklist.set(args[2], {
					type: args[1],
					id: args[2],
				});

				await message.channel.send(`Successfully blocked **${name}** \`(${args[2]})\` from using the bot with the reason \`\`\`${args.slice(3).join(" ")}\`\`\` `);
				break;
			case "remove":
				await databaseManager.removeBlacklist(args[2]);
				this.client.blacklist.delete(args[2]);
				await message.channel.send(`Successfully removed the block from **${args[2]}**`);
				break;

			case "info":
				const info: object = await databaseManager.infoBlacklist(args[2]);
				if (info !== undefined) await message.channel.send(`\`\`\`json\n${JSON.stringify(info, null, 2)}\n\`\`\``);
				else await message.channel.send("User or guild is not blacklisted");

				break;
			default:
				await message.channel.send("Invalid action, use one the following `add`, `remove` or `info`");
				break;
		}
	}
}

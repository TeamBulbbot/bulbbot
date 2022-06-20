import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { isNullish } from "../../utils/helpers";

const databaseManager: DatabaseManager = new DatabaseManager();

// should probably refactor to subcommands
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Blacklists a user/guild from using the bot",
			category: "Admin",
			usage: "<action> <type> <snowflake> [reason]",
			examples: ["blacklist add guild 742094927403679816 spamming commands"],
			minArgs: 3,
			maxArgs: -1,
			argList: ["action:String", "type:String", "snowflake:Snowflake", "reason:String"],
			devOnly: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		switch (args[0].toLowerCase()) {
			case "add":
				let name: string | string;
				try {
					if (args[1] === "guild") name = (await this.client.guilds.fetch(args[2])).name;
					else name = (await this.client.users.fetch(args[2])).tag;
				} catch (error) {
					console.error(error);
					await context.channel.send(`\`${args[2]}\` is not a valid snowflake for the type **${args[1]}**`);
					return;
				}

				if (!args[3]) args[3] = "No reason";

				this.client.log.info(`[DEVELOPER] ${context.author.tag} (${context.author.id}) blacklisted ${args[2]} (type: ${args[1]})`);
				await databaseManager.addBlacklist(args[1] === "guild" ? true : false, name, args[2], args.slice(3).join(" "), context.author.id);
				this.client.blacklist.set(args[2], {
					type: args[1],
					id: args[2],
				});

				await context.channel.send(`Successfully blocked **${name}** \`(${args[2]})\` from using the bot with the reason \`\`\`${args.slice(3).join(" ")}\`\`\` `);
				break;
			case "remove":
				this.client.log.info(`[DEVELOPER] ${context.author.tag} (${context.author.id}) removed the blacklist on ${args[2]} (type: ${args[1]})`);
				await databaseManager.removeBlacklist(args[2]);
				this.client.blacklist.delete(args[2]);
				await context.channel.send(`Successfully removed the block from **${args[2]}**`);
				break;

			case "info":
				const info = await databaseManager.infoBlacklist(args[2]);
				if (!isNullish(info)) await context.channel.send(`\`\`\`json\n${JSON.stringify(info, null, 2)}\n\`\`\``);
				else await context.channel.send("User or guild is not blacklisted");

				break;
			default:
				await context.channel.send("Invalid action, use one the following `add`, `remove` or `info`");
				break;
		}
	}
}

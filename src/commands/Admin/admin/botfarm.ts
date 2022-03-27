import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import { writeFileSync } from "fs";
import { whitelistedGuilds } from "../../../Config";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "botfarm",
			aliases: ["botfarms"],
			minArgs: 1,
			maxArgs: 1,
			argList: ["percent:Number"],
			usage: "<percent>",
			description: "Shows the botfarms with the specified percentage of bots.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const botfarms: any = [];
		let isFile = false;

		this.client.guilds.cache.map((g) => {
			if (Math.round((g.members.cache.filter((u) => u.user.bot).size / g.members.cache.size) * 100) < parseInt(args[0])) return;
			if (whitelistedGuilds.includes(g.id)) return;

			botfarms.push({
				id: g.id,
				name: g.name,
				members: g.members.cache.filter((u) => !u.user.bot).size,
				bots: g.members.cache.filter((u) => u.user.bot).size,
				botP: Math.round((g.members.cache.filter((u) => u.user.bot).size / g.members.cache.size) * 100),
			});
		});

		botfarms.sort(dynamicSort("botP"));
		const content: string = await botfarms.map((bf: any) => `\`\`\`\nName: ${bf.name}\nId: ${bf.id}\nMembers: ${bf.members}\nBots: ${bf.bots}\n% Bots: ${bf.botP}\`\`\``).join("");
		if (content.length > 1800) {
			writeFileSync(`${__dirname}/../../../../files/BOT-FARM-${context.guild?.id}.json`, JSON.stringify(botfarms, null, 2)), "utf8";
			isFile = true;
		}

		context.channel.send({
			content: !isFile ? content : null,
			files: isFile
				? [
						{
							attachment: `${__dirname}/../../../../files/BOT-FARM-${context.guild?.id}.json`,
							name: "botfarms.json",
						},
				  ]
				: [],
		});
	}
}

function dynamicSort(property: any) {
	let sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.slice(1);
	}
	return function (a: any, b: any) {
		const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

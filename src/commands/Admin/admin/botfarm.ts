import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Guild, Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import { writeFileSync } from "fs";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "botfarm",
			minArgs: 1,
			maxArgs: 1,
			argList: ["percent:number"],
			usage: "<percent>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		this.client.guilds.cache.map(async (guild: Guild) => await guild.members.fetch());

		let botfarms: any = [];
		let isFile: boolean = false;

		const whitelisted: string[] = ["742094927403679816", "784408056997216327", "818176562901549066", "820945336327602186"];

		this.client.guilds.cache.map(g => {
			if (Math.round((g.members.cache.filter(u => u.user.bot).size / g.members.cache.size) * 100) < parseInt(args[0])) return;
			if (whitelisted.includes(g.id)) return;

			botfarms.push({
				id: g.id,
				name: g.name,
				members: g.members.cache.filter(u => !u.user.bot).size,
				bots: g.members.cache.filter(u => u.user.bot).size,
				botP: Math.round((g.members.cache.filter(u => u.user.bot).size / g.members.cache.size) * 100),
			});
		});

		botfarms = await botfarms.sort(dynamicSort("botP"));
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
	var sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a: any, b: any) {
		var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
		return result * sortOrder;
	};
}

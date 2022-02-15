import Command from "../../structures/Command";
import override from "./configure/override";
import BulbBotClient from "../../structures/BulbBotClient";
import CommandContext from "../../structures/CommandContext";
import { Message, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import * as Emotes from "../../emotes.json";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configure the bot in your server",
			category: "Configuration",
			subCommands: [override],
			aliases: ["cfg", "conf", "config", "setting"],
			usage: "<setting>",
			examples: ["configure prefix <prefix>", "configure logging mod_action <channel>"],
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("configure-main")
				.setPlaceholder(await this.client.bulbutils.translate("config_main_placeholder", context.guild?.id, {}))
				.addOptions([
					{
						label: await this.client.bulbutils.translate("config_main_option_actions_on_info", context.guild?.id, {}),
						value: "actionsOnInfo",
						description: "Configure the actions on info setting",
						emoji: Emotes.configure.ACTIONS_ON_INFO,
					},
					{
						label: "Automod",
						value: "automod",
						description: "Configure the Automod settings",
						emoji: Emotes.configure.AUTOMOD,
					},
					{
						label: "Autorole",
						value: "autorole",
						description: "Configure the autorole setting",
						emoji: Emotes.configure.AUTOROLE,
					},
					{
						label: await this.client.bulbutils.translate("config_main_option_language", context.guild?.id, {}),
						value: "language",
						emoji: Emotes.configure.LANGUAGE,
						description: "Change the language of the bot",
					},
					{
						label: "Logging",
						value: "logging",
						description: "Configure the logging modules",
						emoji: Emotes.configure.LOGGING,
					},
					{
						label: await this.client.bulbutils.translate("config_main_option_prefix", context.guild?.id, {}),
						value: "prefix",
						description: "Configure the prefix of the bot",
						emoji: Emotes.features.MEMBER_LIST_DISABLED,
					},
					{
						label: "Quick Reasons",
						value: "quickReasons",
						description: "Add or remove quick reasons",
						emoji: Emotes.features.MEMBER_PROFILES,
					},
					{
						label: await this.client.bulbutils.translate("config_main_option_roles_on_leave", context.guild?.id, {}),
						value: "rolesOnLeave",
						description: "Configure the roles on leave setting",
						emoji: Emotes.features.HUB,
					},
					{
						label: "Timezone",
						value: "timezone",
						description: "Configure the timezone for logging",
						emoji: Emotes.configure.TIMEZONE,
					},
				]),
		);

		await context.channel.send({content: await this.client.bulbutils.translate("config_main_header", context.guild?.id, {
				guild: context.guild,
			}), components: [row]});

		const filter = i => i.user.id === context.user.id;
		const collector = context.channel?.createMessageComponentCollector({ filter, time: 60000, max: 1 });

		collector?.on("collect", async (i: MessageComponentInteraction) => {
			if (i.isSelectMenu()) {
				switch (i.values[0]) {
					case "actionsOnInfo":
						await require("./configure/actionsOnInfo").default(i, this.client);
						break;
					case "automod":
						await require("./configure/automod").default(i, this.client);
						break;
					case "autorole":
						await require("./configure/autorole").default(i, this.client);
						break;
					case "language":
						await require("./configure/language").default(i, this.client);
						break;
					case "logging":
						await require("./configure/logging").default(i, this.client);
						break;
					case "prefix":
						await require("./configure/prefix").default(i, this.client);
						break;
					case "quickReasons":
						await require("./configure/quickReasons").default(i, this.client);
						break;
					case "rolesOnLeave":
						await require("./configure/rolesOnLeave").default(i, this.client);
						break;
					case "timezone":
						await require("./configure/timezone").default(i, this.client);
						break;
				}
			}
		})
	}
}

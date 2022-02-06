import Command from "../../structures/Command";
import timezone from "./configure/timezone";
import prefix from "./configure/prefix";
import logging from "./configure/logging";
import autorole from "./configure/autorole";
import override from "./configure/override";
import automod from "./configure/automod";
import BulbBotClient from "../../structures/BulbBotClient";
import actionsOnInfo from "./configure/actionsOnInfo";
import rolesOnLeave from "./configure/rolesOnLeave";
import language from "./configure/language";
import quickReasons from "./configure/quickReasons";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configure the bot in your server",
			category: "Configuration",
			subCommands: [timezone, prefix, logging, autorole, override, automod, actionsOnInfo, language, rolesOnLeave, quickReasons],
			aliases: ["cfg", "conf", "config", "setting"],
			usage: "<setting>",
			examples: ["configure prefix <prefix>", "configure logging mod_action <channel>"],
			argList: ["setting:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}
}

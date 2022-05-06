import BulbBotClient from "../structures/BulbBotClient";
import { discordApi, developerGuild } from "../Config";
import axios from "axios";

export async function registerSlashCommands(client: BulbBotClient) {
	const isDev = process.env.ENVIRONMENT === "dev";

	function data() {
		const cmds: any[] = [];
		for (const command of client.commands.values()) {
			cmds.push({
				name: command.name,
				type: command.type,
				description: command.description,
				default_permissions: command.default_member_permissions,
				options: command.options,
			});
		}

		return cmds;
	}

	const options: any = {
		method: "PUT",
		url: `${discordApi}/applications/${client.user?.id}/${isDev ? `guilds/${developerGuild}/` : ""}commands`,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${process.env.TOKEN}`,
		},
		data: data(),
	};

	try {
		const response = await axios.request(options);
		client.log.info(`[APPLICATION COMMANDS] Registered all of the slash commands, amount: ${response.data.length}`);
	} catch (err: any) {
		client.log.error(`[APPLICATION COMMANDS] Failed to register slash commands: ${err}`);
	}
}

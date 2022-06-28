import BulbBotClient from "../structures/BulbBotClient";
import { discordApi } from "../Config";
import axios from "axios";
import { LocalCode, Localization } from "./types/Localization";
import i18next from "i18next";
import { APIApplicationCommand, ApplicationCommandType } from "discord-api-types/v10";

export function translateSlashCommands(key: string) {
	const TRANSLATED_LANGS: LocalCode[] = ["es-ES", "hu", "fr", "cs", "sv-SE", "hi"];
	return Object.fromEntries(
		TRANSLATED_LANGS.map((lng) => [
			lng,
			i18next.t(key, {
				lng,
			}) as string,
		]),
	) as Localization;
}

export async function registerSlashCommands(client: BulbBotClient) {
	const isDev: boolean = process.env.ENVIRONMENT === "dev";

	const data = () => {
		const cmds: Omit<APIApplicationCommand, "id" | "application_id" | "version">[] = [];
		for (const command of client.commands.values()) {
			if (command.subCommands !== []) command.options = [...command.options, ...command.subCommands.map((subCommand) => subCommand.options[0])];
			console.log(command.options);

			cmds.push({
				name: command.name,
				type: command.type as ApplicationCommandType,
				description: command.description,
				name_localizations: translateSlashCommands(`sc_${command.name}_name`),
				description_localizations: translateSlashCommands(`sc_${command.name}_desc`),
				default_member_permissions: command.default_member_permissions,
				dm_permission: command.dm_permission,
				options: command.options,
			});
		}

		return cmds;
	};

	if (!process.env.DEVELOPER_GUILD) throw new Error("missing process.env.DEVELOPER_GUILD, add that to the .env file");
	const options = {
		method: "PUT",
		url: `${discordApi}/applications/${client.user?.id}/${isDev ? `guilds/${process.env.DEVELOPER_GUILD}/` : ""}commands`,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bot ${process.env.TOKEN}`,
		},
		data: data(),
	} as const;

	try {
		const response = await axios.request(options);
		client.log.info(`[APPLICATION COMMANDS] Registered all of the slash commands, amount: ${response.data.length}`);
	} catch (err: any) {
		client.log.error(`[APPLICATION COMMANDS] Failed to register slash commands: ${err.response.statusText} (${err})`);
	}
}

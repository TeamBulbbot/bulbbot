import BulbBotClient from "../structures/BulbBotClient";
import { discordApi } from "../Config";
import axios from "axios";
import { LocalCode, Localization } from "./types/Localization";
import i18next from "i18next";
import { APIApplicationCommand, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

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
		const publicCmds: Omit<APIApplicationCommand, "id" | "application_id" | "version">[] = [];
		const developerCmds: Omit<APIApplicationCommand, "id" | "application_id" | "version">[] = [];

		for (const command of client.commands.values()) {
			if (command.subCommands.length) {
				for (const subCommand of command.subCommands) {
					command.options.push({
						name: subCommand.name,
						description: subCommand.description,
						type: ApplicationCommandOptionType.Subcommand,
						// FIXME: There has got to be a better solution than just @ts-expect-error
						// @ts-expect-error
						options: subCommand.options,
					});
				}
			}

			const cmd = {
				name: command.name,
				type: command.type as ApplicationCommandType,
				description: command.description,
				name_localizations: translateSlashCommands(`sc_${command.name}_name`),
				description_localizations: translateSlashCommands(`sc_${command.name}_desc`),
				default_member_permissions: command.default_member_permissions,
				dm_permission: command.dm_permission,
				options: command.options,
			};

			command.devOnly ? developerCmds.push(cmd) : publicCmds.push(cmd);
		}

		return { publicCmds, developerCmds };
	};

	const { publicCmds, developerCmds } = data();
	if (!process.env.DEVELOPER_GUILD) throw new Error("missing process.env.DEVELOPER_GUILD, add that to the .env file");

	const response = await axios.put(
		`${discordApi}/applications/${client.user?.id}/${isDev ? `guilds/${process.env.DEVELOPER_GUILD}/` : ""}commands`,
		isDev ? [...publicCmds, ...developerCmds] : publicCmds,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${process.env.TOKEN}`,
			},
		},
	);

	if (!isDev)
		await axios.put(`${discordApi}/applications/${client.user?.id}/guilds/${process.env.DEVELOPER_GUILD}/commands`, developerCmds, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${process.env.TOKEN}`,
			},
		});

	client.log.info(`[APPLICATION COMMANDS] Registered all of the slash commands, amount: ${response.data.length}`);
}

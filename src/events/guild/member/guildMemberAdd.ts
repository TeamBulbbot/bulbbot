import Event from "../../../structures/Event";
import { GuildMember } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import imageHash from "imghash";
import axios from "axios";
import { AutoModConfiguration } from "../../../utils/types/DatabaseStructures";
import AutoModManager from "../../../utils/managers/AutoModManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();
export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(member: GuildMember): Promise<void> {
		await loggingManager.sendEventLog(
			this.client,
			member.guild,
			"joinLeave",
			await this.client.bulbutils.translate("event_member_joined", member.guild.id, {
				user: member.user,
				user_age: Math.floor(member.user.createdTimestamp / 1000),
			}),
		);

		const automod: AutoModConfiguration = await databaseManager.getAutoModConfig(member.guild.id);
		if (automod.enabled && automod.avatarHashes.length > 0 && automod.punishmentAvatarBans) {
			const buffer = await axios.get(member?.displayAvatarURL(), {
				responseType: "arraybuffer",
			});
			const avatarHash = await imageHash.hash(buffer.data, 8);
			if (automod.avatarHashes.includes(avatarHash)) {
				const automodManager: AutoModManager = new AutoModManager();

				const punishment: string = await automodManager.resolveActionWithoutContext(
					this.client,
					member,
					automod.punishmentAvatarBans,

					await this.client.bulbutils.translate("automod_violation_avatar_reason", member.guild.id, {}),
				);
				await loggingManager.sendAutoModLog(
					this.client,
					member.guild,
					await this.client.bulbutils.translate("automod_violation_avatar_log", member.guild.id, {
						user: member.user,
						punishment,
						hash: avatarHash,
					}),
					buffer.data,
				);
			}
		}

		if (member.pending) return;
		const config: Record<string, any> = await databaseManager.getConfig(member.guild.id);
		if (!config["autorole"]) return;

		await member.roles.add(config["autorole"]);
	}
}

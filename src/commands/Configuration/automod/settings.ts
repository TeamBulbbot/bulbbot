import { Message, MessageEmbed } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import Command from "../../../structures/Command";
import { AutoModConfiguration } from "../../../utils/types/AutoModConfiguration";
import { embedColor } from "../../../Config";
import Emotes from "../../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "enable",
			clearance: 75,
			maxArgs: 0,
			usage: "!automod enable",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void> {
		const dbGuild: AutoModConfiguration = await databaseManager.getAutoModConfig(message.guild!.id);

		const roles: string[] = [];
		const channels: string[] = [];
		const users: string[] = [];

		dbGuild.ignoreRoles.length ? dbGuild.ignoreRoles.forEach(role => (roles.push(`<@&${role}>`))) : (roles.push("None"));
		dbGuild.ignoreChannels.length ? dbGuild.ignoreChannels.forEach(channel => (channels.push(`<#${channel}>`))) : (channels.push("None"));
		dbGuild.ignoreUsers.length ? dbGuild.ignoreUsers.forEach(user => (users.push(`<@${user}>`))) : (users.push("None"));

		const description: string[] = [];

		description.push(await this.client.bulbutils.translate("automod_settings_enabled", message.guild?.id, {
			part: dbGuild.enabled ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_websites", message.guild?.id, {
			part: dbGuild.punishmentWebsite !== null ? `\`${dbGuild.punishmentWebsite}\`` : Emotes.other.SWITCHOFF,
			item: dbGuild.websiteWhitelist.length ? dbGuild.websiteWhitelist.join(" ") : "None",
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_invites", message.guild?.id, {
			part: dbGuild.punishmentInvites !== null ? `\`${dbGuild.punishmentInvites}\`` : Emotes.other.SWITCHOFF,
			item: dbGuild.inviteWhitelist.length ? dbGuild.inviteWhitelist.join(" ") : "None",
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_words", message.guild?.id, {
			part: dbGuild.punishmentWords !== null ? `\`${dbGuild.punishmentWords}\`` : Emotes.other.SWITCHOFF,
			item: dbGuild.wordBlacklist.length ? dbGuild.wordBlacklist.join(" ") : "None",
			count: dbGuild.wordBlacklistToken.length ? dbGuild.wordBlacklistToken.join(" ") : "None",
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_mentions", message.guild?.id, {
			part: dbGuild.punishmentMentions ? `\`${dbGuild.punishmentMentions}\`` : Emotes.other.SWITCHOFF,
			amount: dbGuild.limitMentions,
			limit: dbGuild.timeoutMentions / 1000,
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_messages", message.guild?.id, {
			part: dbGuild.punishmentMessages ? `\`${dbGuild.punishmentMessages}\`` : Emotes.other.SWITCHOFF,
			amount: dbGuild.limitMessages,
			limit: dbGuild.timeoutMessages / 1000,
		}));

		description.push(await this.client.bulbutils.translate("automod_settings_ignored", message.guild?.id, {
			role: roles.join(" "),
			channel_id: channels.join(" "),
			target_tag: users.join(" "),
		}));

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(
				await this.client.bulbutils.translate("automod_settings_header", message.guild?.id, {
					guild_name: message.guild?.name,
				}),
				message.guild!.iconURL({ dynamic: true }) ?? undefined,
			)
			.setDescription(description.join("\n\n"))
			.setFooter(await this.client.bulbutils.translate("automod_settings_footer", message.guild?.id, {}), "https://cdn.discordapp.com/emojis/833770837575860305.png?v=1");

		await message.channel.send(embed);
	}
}

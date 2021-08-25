import { Message, MessageEmbed } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import AutoModConfiguration from "../../../../utils/types/AutoModConfiguration";
import { embedColor } from "../../../../Config";
import Emotes from "../../../../emotes.json";
import BulbBotClient from "../../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "settings",
			clearance: 75,
			maxArgs: 0,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const dbGuild: AutoModConfiguration = await databaseManager.getAutoModConfig(context.guild!.id);

		const roles: string[] = [];
		const channels: string[] = [];
		const users: string[] = [];

		dbGuild.ignoreRoles.length ? dbGuild.ignoreRoles.forEach(role => roles.push(`<@&${role}>`)) : roles.push("None");
		dbGuild.ignoreChannels.length ? dbGuild.ignoreChannels.forEach(channel => channels.push(`<#${channel}>`)) : channels.push("None");
		dbGuild.ignoreUsers.length ? dbGuild.ignoreUsers.forEach(user => users.push(`<@${user}>`)) : users.push("None");

		const description: string[] = [];

		description.push(
			await this.client.bulbutils.translate("automod_settings_enabled", context.guild?.id, {
				enabled: dbGuild.enabled ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_websites", context.guild?.id, {
				enabled: dbGuild.punishmentWebsite !== null ? `\`${dbGuild.punishmentWebsite}\`` : Emotes.other.SWITCHOFF,
				websites_blacklist: dbGuild.websiteWhitelist.length ? dbGuild.websiteWhitelist.join(" ") : "None",
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_invites", context.guild?.id, {
				enabled: dbGuild.punishmentInvites !== null ? `\`${dbGuild.punishmentInvites}\`` : Emotes.other.SWITCHOFF,
				invites_blacklist: dbGuild.inviteWhitelist.length ? dbGuild.inviteWhitelist.join(" ") : "None",
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_words", context.guild?.id, {
				enabled: dbGuild.punishmentWords !== null ? `\`${dbGuild.punishmentWords}\`` : Emotes.other.SWITCHOFF,
				word_blacklist: dbGuild.wordBlacklist.length ? dbGuild.wordBlacklist.join(" ") : "None",
				word_token_blacklist: dbGuild.wordBlacklistToken.length ? dbGuild.wordBlacklistToken.join(" ") : "None",
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_mentions", context.guild?.id, {
				enabled: dbGuild.punishmentMentions ? `\`${dbGuild.punishmentMentions}\`` : Emotes.other.SWITCHOFF,
				limit: dbGuild.limitMentions,
				timeout: dbGuild.timeoutMentions / 1000,
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_messages", context.guild?.id, {
				enabled: dbGuild.punishmentMessages ? `\`${dbGuild.punishmentMessages}\`` : Emotes.other.SWITCHOFF,
				limit: dbGuild.limitMessages,
				timeout: dbGuild.timeoutMessages / 1000,
			}),
		);

		description.push(
			await this.client.bulbutils.translate("automod_settings_ignored", context.guild?.id, {
				roles: roles.join(" "),
				channels: channels.join(" "),
				users: users.join(" "),
			}),
		);

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(await this.client.bulbutils.translate("automod_settings_header", context.guild?.id, { guild: context.guild }), context.guild!.iconURL({ dynamic: true }) ?? undefined)
			.setDescription(description.join("\n\n"))
			.setFooter(await this.client.bulbutils.translate("automod_settings_footer", context.guild?.id, {}), "https://cdn.discordapp.com/emojis/833770837575860305.png?v=1");

		await context.channel.send({ embeds: [embed] });
	}
}

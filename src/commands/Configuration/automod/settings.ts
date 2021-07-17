import BulbBotClient from "../../../structures/BulbBotClient";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import { embedColor } from "../../../Config";
import { AutoModConfiguration } from "../../../utils/types/AutoModConfiguration";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import * as Emotes from "../../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default async function (client: BulbBotClient, message: Message): Promise<Message | void> {
	const dbGuild: AutoModConfiguration = await databaseManager.getAutoModConfig(<Snowflake>message.guild?.id);

	let roles: string = "";
	let channels: string = "";
	let users: string = "";

	dbGuild.ignoreRoles.length ? dbGuild.ignoreRoles.forEach(role => (roles += `<@&${role}> `)) : (roles = "None");
	dbGuild.ignoreChannels.length ? dbGuild.ignoreChannels.forEach(channel => (channels += `<#${channel}> `)) : (channels = "None");
	dbGuild.ignoreUsers.length ? dbGuild.ignoreUsers.forEach(user => (users += `<@${user}> `)) : (users = "None");

	let description: string = "";

	description += await client.bulbutils.translate("automod_settings_enabled", message.guild?.id, {
		part: dbGuild.enabled ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF,
	});

	description += await client.bulbutils.translate("automod_settings_websites", message.guild?.id, {
		part: dbGuild.punishmentWebsite !== null ? `\`${dbGuild.punishmentWebsite}\`` : Emotes.other.SWITCHOFF,
		item: dbGuild.websiteWhitelist.length ? dbGuild.websiteWhitelist.join(" ") : "None",
	});

	description += await client.bulbutils.translate("automod_settings_invites", message.guild?.id, {
		part: dbGuild.punishmentInvites !== null ? `\`${dbGuild.punishmentInvites}\`` : Emotes.other.SWITCHOFF,
		item: dbGuild.inviteWhitelist.length ? dbGuild.inviteWhitelist.join(" ") : "None",
	});

	description += await client.bulbutils.translate("automod_settings_words", message.guild?.id, {
		part: dbGuild.punishmentWords !== null ? `\`${dbGuild.punishmentWords}\`` : Emotes.other.SWITCHOFF,
		item: dbGuild.wordBlacklist.length ? dbGuild.wordBlacklist.join(" ") : "None",
		count: dbGuild.wordBlacklistToken.length ? dbGuild.wordBlacklistToken.join(" ") : "None",
	});

	description += await client.bulbutils.translate("automod_settings_mentions", message.guild?.id, {
		part: dbGuild.punishmentMentions ? `\`${dbGuild.punishmentMentions}\`` : Emotes.other.SWITCHOFF,
		amount: dbGuild.limitMentions,
		limit: dbGuild.timeoutMentions / 1000,
	});

	description += await client.bulbutils.translate("automod_settings_messages", message.guild?.id, {
		part: dbGuild.punishmentMessages ? `\`${dbGuild.punishmentMessages}\`` : Emotes.other.SWITCHOFF,
		amount: dbGuild.limitMessages,
		limit: dbGuild.timeoutMessages / 1000,
	});

	description += await client.bulbutils.translate("automod_settings_ignored", message.guild?.id, {
		role: roles,
		channel_id: channels,
		target_tag: users,
	});

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor(
			await client.bulbutils.translate("automod_settings_header", message.guild?.id, {
				guild_name: message.guild?.name,
			}),
			<string>message.guild?.iconURL({ dynamic: true }),
		)
		.setDescription(description)
		.setFooter(await client.bulbutils.translate("automod_settings_footer", message.guild?.id, {}), "https://cdn.discordapp.com/emojis/833770837575860305.png?v=1");

	await message.channel.send(embed);
}

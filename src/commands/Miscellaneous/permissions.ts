import { CommandInteraction, MessageEmbed } from "discord.js";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const bint0 = BigInt(0);
const bint1 = BigInt(1);
const bint2 = BigInt(2);
// const PERM_STRINGS = Object.keys(Permissions.FLAGS);
// New permissions currently missing from D.JS
// Maybe I'll just make an automatic API endpoint for this later
const PERM_STRINGS = [
	"CREATE_INSTANT_INVITE",
	"KICK_MEMBERS", // 0, 1
	"BAN_MEMBERS",
	"ADMINISTRATOR", // 2, 3
	"MANAGE_CHANNELS",
	"MANAGE_GUILD", // 4, 5
	"ADD_REACTIONS",
	"VIEW_AUDIT_LOG", // 6, 7
	"PRIORITY_SPEAKER",
	"STREAM", // 8, 9
	"VIEW_CHANNEL",
	"SEND_MESSAGES", // 10, 11
	"SEND_TTS_MESSAGES",
	"MANAGE_MESSAGES", // 12, 13
	"EMBED_LINKS",
	"ATTACH_FILES", // 14, 15
	"READ_MESSAGE_HISTORY",
	"MENTION_EVERYONE", // 16, 17
	"USE_EXTERNAL_EMOJIS",
	"VIEW_GUILD_INSIGHTS", // 18, 19
	"CONNECT",
	"SPEAK", // 20, 21
	"MUTE_MEMBERS",
	"DEAFEN_MEMBERS", // 22, 23
	"MOVE_MEMBERS",
	"USE_VAD", // 24, 25
	"CHANGE_NICKNAME",
	"MANAGE_NICKNAMES", // 26, 27
	"MANAGE_ROLES",
	"MANAGE_WEBHOOKS", // 28, 29
	"MANAGE_EMOJIS_AND_STICKERS",
	"USE_APPLICATION_COMMANDS", // 30, 31
	"REQUEST_TO_SPEAK",
	"UNUSED", // 32, 33
	"MANAGE_THREADS",
	"CREATE_PUBLIC_THREADS", // 34, 35
	"CREATE_PRIVATE_THREADS",
	"USE_EXTERNAL_STICKERS", // 36, 37
	"SEND_MESSAGES_IN_THREADS",
	"START_EMBEDDED_ACTIVITIES",
]; // 38, 39
const log10 = (num: number) => (num ? Math.log10(num) : 0);
const loglen = ~~log10(PERM_STRINGS.length);

export default class Permissions extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Gets permission names from a permission BitField",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "permissions",
					description: "The permission BitField to destructure",
					type: ApplicationCommandOptionType.Integer,
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const bitfield = interaction.options.getInteger("permissions") as number;

		// Decimal-to-Binary conversion algorithm
		// This is closely based on the algorithm taught for doing written conversions
		let permsInt = BigInt(bitfield);
		const permissionStrings: string[] = [];
		for (let i = 0; permsInt > bint0 && i < PERM_STRINGS.length; permsInt >>= bint1, ++i) {
			const val = permsInt % bint2;
			if (val) permissionStrings.push(`\`1 << ${" ".repeat(loglen - ~~log10(i))}${i}\` - \`${PERM_STRINGS[i]}\``);
		}

		// There are better ways to accomplish dynamic first-letter-capitalization but am going to leave that for later
		let noneWord = await this.client.bulbutils.translate("global_words.none", interaction.guild?.id, {});
		noneWord = noneWord[0].toUpperCase() + noneWord.slice(1);

		const embed = new MessageEmbed()
			.setTitle(`Permissions of: ${BigInt(bitfield)}`)
			.setColor(Config.embedColor)
			.setDescription(permissionStrings.length ? permissionStrings.join("\n") : `*${noneWord}*`)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}
}

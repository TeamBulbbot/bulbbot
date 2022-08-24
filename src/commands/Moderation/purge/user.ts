import { Collection, CommandInteraction, Guild, GuildMember, GuildTextBasedChannel, Message, Snowflake } from "discord.js";
import moment from "moment";
import { writeFile } from "fs/promises";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { APIGuildMember, ApplicationCommandOptionType } from "discord-api-types/v10";
import { filesDir } from "../../..";

const loggingManager: LoggingManager = new LoggingManager();

export default class PurgeUser extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "user",
			description: "Purge messages from a user.",
			options: [
				{
					name: "member",
					description: "The member to purge messages from.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "amount",
					description: "The amount of messages to purge.",
					type: ApplicationCommandOptionType.Integer,
					required: true,
					min_value: 2,
					max_value: 499,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let member = interaction.options.getMember("member") as GuildMember | APIGuildMember;
		let amount = interaction.options.getInteger("amount") as number;

		if (!member)
			return interaction.reply({
				content: await this.client.bulbutils.translate("global_not_found.member", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!(member instanceof GuildMember)) member = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.options.get("member")?.value as Snowflake)) as GuildMember;

		const deleteMsg: number[] = [];
		let a = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs = await this.client.bulbutils.translate("purge_message_log", interaction.guild?.id, {
			user: interaction.user,
			channel: interaction.channel as GuildTextBasedChannel,
			timestamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
		});

		const messagesToPurge: Snowflake[] = [];
		amount = 0;

		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await (interaction.channel as GuildTextBasedChannel)?.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async (m) => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				// FIXME: Why is this happening? I have handled this in the past and it worked fine.
				// @ts-expect-error
				if (member.user.id === m.author.id) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await (interaction.channel as GuildTextBasedChannel)?.bulkDelete(messagesToPurge);

		await writeFile(`${filesDir}/PURGE-${interaction.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(
			this.client,
			interaction.guild as Guild,
			"purge",
			amount,
			`${filesDir}/PURGE-${interaction.guild?.id}.txt`,
			interaction.channel as GuildTextBasedChannel,
			interaction.user,
		);

		return interaction.reply(await this.client.bulbutils.translate("purge_success", interaction.guild?.id, { count: amount }));
	}
}

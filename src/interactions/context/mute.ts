import { ContextMenuInteraction, Guild, GuildMember, Message, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, Snowflake } from "discord.js";
import moment from "moment";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const target: GuildMember = <GuildMember>message.member;
	const timezone = client.bulbutils.timezones[await databaseManager.getTimezone(<Snowflake>message.guild?.id)];
	const reason = await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});

	const reasons: string[] = (await databaseManager.getConfig(target.guild.id)).quickReasons;
	reasons.push(await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

	const options: MessageSelectOptionData[] = [];
	for (const reason of reasons) {
		options.push({ label: reason, value: reason });
	}

	const row: MessageActionRow = new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder("Select a reason").setCustomId("warn").addOptions(options));

	await interaction.reply({
		content: await client.bulbutils.translate("userinfo_interaction_confirm", interaction.guild?.id, {
			target: target.user,
			action: await client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
		}),
		components: [row],
		ephemeral: true,
	});

	const collector = interaction.channel?.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 30000 });

	collector?.on("collect", async (i: SelectMenuInteraction) => {
		if (interaction.user.id !== i.user.id) return;

		const infID = await infractionsManager.mute(
			client,
			<Guild>message.guild,
			target,
			<GuildMember>interaction.member,
			await client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: await client.bulbutils.translate("mod_action_types.mute", message.guild?.id, {}),
				moderator: message.author,
				target: target.user,
				reason,
				until: Date.now() + 3600000,
			}),
			reason,
			Date.now() + 3600000,
		);

		await i.update({
			content: await client.bulbutils.translate("action_success_temp", interaction.guild?.id, {
				action: await client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
				until: moment(Date.now() + 3600000)
					.tz(timezone)
					.format("MMM Do YYYY, h:mm:ssa z"),
			}),
			components: [],
		});

		collector.stop();
	});
}

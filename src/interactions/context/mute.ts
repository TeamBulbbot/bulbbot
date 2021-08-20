import { ContextMenuInteraction, Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import moment from "moment";
import { MuteType } from "../../utils/types/MuteType";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import MuteManger from "../../utils/managers/MuteManger";
import { setTimeout } from "safe-timers";

const infractionsManager: InfractionsManager = new InfractionsManager();
const databaseManager: DatabaseManager = new DatabaseManager();

const { createMute, deleteMute, getLatestMute }: MuteManger = new MuteManger();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const muteRole = await databaseManager.getMuteRole(<Snowflake>interaction.guild?.id);
	const target: GuildMember = <GuildMember>await interaction.guild?.members.fetch(message.author.id);
	const timezone = client.bulbutils.timezones[await databaseManager.getTimezone(<Snowflake>message.guild?.id)];
	const reason = await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});

	if (!muteRole) return interaction.reply({ content: await client.bulbutils.translate("mute_muterole_not_found", interaction.guild?.id, {}), ephemeral: true });
	if (target.roles.cache.get(muteRole))
		return interaction.reply({ content: await client.bulbutils.translate("mute_already_muted", interaction.guild?.id, { target: message.author }), ephemeral: true });

	let infID = await infractionsManager.mute(
		client,
		<Guild>message.guild,
		target,
		<GuildMember>message.member,
		await client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.mute", message.guild?.id, {}),
			moderator: message.author,
			target: target.user,
			reason,
			until: Date.now() + 3600000,
		}),
		reason,
		muteRole,
		Date.now() + 3600000,
	);

	await interaction.reply({
		content: await client.bulbutils.translate("action_success_temp", interaction.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
			target: target.user,
			reason,
			infraction_id: infID,
			until: moment(Date.now() + 3600000)
				.tz(timezone)
				.format("MMM Do YYYY, h:mm:ssa z"),
		}),
		ephemeral: true,
	});

	await createMute(target, reason, Date.now() + 3600000, message.guild!.id);
	const mute: any = await getLatestMute(target, message.guild!.id);

	setTimeout(async function () {
		if ((await infractionsManager.isActive(<Snowflake>interaction.guild?.id, infID)) === false) return;
		await infractionsManager.setActive(<Snowflake>interaction.guild?.id, infID, false);

		infID = await infractionsManager.unmute(
			client,
			<Guild>message.guild,
			MuteType.AUTO,
			target,
			<User>client.user,
			await client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
				action: await client.bulbutils.translate("mod_action_types.unmute", interaction.guild?.id, {}),
				moderator: client.user,
				target: target.user,
				reason: "Automatic unmute",
			}),
			"Automatic unmute",
			muteRole,
		);

		await deleteMute(mute.id);
	}, 3600000);
}

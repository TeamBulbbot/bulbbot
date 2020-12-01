const Log = require("../utils/moderation/log");
const moment = require("moment");
const Translator = require("../utils/lang/translator")
const Moderation = require("../utils/moderation/moderation")

module.exports = async (client, user) => {
	const end = moment.utc().format("YYYY-MM-DD");
	let start = moment(moment.utc(user.user.createdAt).format("YYYY-MM-DD"));
	const accountAgeInDays = moment.duration(start.diff(end)).asDays();

	await Log.Join_leave_log(
		client,
		user.guild.id,
		Translator.Translate("event_guild_member_remove",
			{
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				age: Math.floor(accountAgeInDays).toString().replace("-", "")
			})
	)

	const log = await user.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_KICK'});
	const kickLog = log.entries.first();
	if (!kickLog) return;

	let { executor, reason, target } = kickLog;
	if (executor.id === client.user.id) return;
	if (kickLog.createdAt < user.joinedAt) return;
	if (user.id !== target.id) return;

	if (reason === null) reason = "No reason given"

	await Log.Mod_action(
		client,
		user.guild.id,
		Translator.Translate("event_guild_member_kick",
			{
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				moderator: executor.username,
				moderator_discriminator: executor.discriminator,
				moderator_id: executor.id,
				reason: reason
			}),
		""
	)

	await Moderation.Kick(client, user.guild.id, user.user.id, executor.id, reason)
};

const Log = require("../utils/moderation/log");
const moment = require("moment");
const Translator = require("../utils/lang/translator")

module.exports = async (client, user) => {
	const end = moment.utc().format("YYYY-MM-DD");
	let start = moment(moment.utc(user.user.createdAt).format("YYYY-MM-DD"));
	const accountAgeInDays = moment.duration(start.diff(end)).asDays();

	Log.Join_leave_log(
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
};

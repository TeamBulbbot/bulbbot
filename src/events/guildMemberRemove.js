const Log = require("../utils/moderation/log");
const Emotes = require("../emotes.json");
const moment = require("moment");

module.exports = async (client, user) => {
	const end = moment.utc().format("YYYY-MM-DD");
	let start = moment(moment.utc(user.user.createdAt).format("YYYY-MM-DD"));
	const accountAgeInDays = moment.duration(start.diff(end)).asDays();

	Log.Join_leave_log(
		client,
		user.guild.id,
		`${Emotes.other.minus} User left guild **${user.user.username}**#${
			user.user.discriminator
		} \`\`(${user.user.id})\`\` - **Account Age:** ${Math.floor(
			accountAgeInDays
		)
			.toString()
			.replace("-", "")} days`,
		""
	);
};

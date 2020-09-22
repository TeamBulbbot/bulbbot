const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");
const moment = require("moment");

module.exports = async (client, user) => {
	const end = moment.utc().format("YYYY-MM-DD");
	let start = moment(moment.utc(user.user.createdAt).format("YYYY-MM-DD"));
	const accountAgeInDays = moment.duration(start.diff(end)).asDays();
	start = moment(moment.utc(user.user.joinedTimestamp).format("YYYY-MM-DD"));
	const daysInServer = moment.duration(start.diff(end)).asDays();

	SendLog.Join_leave_log(
		client,
		user.guild.id,
		`User left guild **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` - **Account Age:** ${Math.floor(accountAgeInDays).toString().replace("-", "")} days - **Days in guild:** ${Math.floor(daysInServer).toString().replace("-", "")} days`,
		""
	);
};

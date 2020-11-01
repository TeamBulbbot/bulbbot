const moment = require("moment");

module.exports = {
	name: "uploadlogs",
	category: "developer",
	description: "Upload the logs to the current discord channel",
	usage: "uploadlogs",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "ATTACH_FILES"],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		let developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			return message.channel.send(
				`Sending log files as of ${moment().format(
					"MMMM Do YYYY, h:mm:ss a"
				)} `,
				{
					files: [`./src/logs/log.log`],
				}
			);
		}
	},
};

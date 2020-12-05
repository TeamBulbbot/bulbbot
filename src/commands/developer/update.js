const Update = require("../../utils/database/update");

module.exports = {
	name: "update",
	category: "developer",
	description: "XXXX",
	usage: "XXXX",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		let developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			Update.AddInfIdToAllInfraction();

			message.channel.send("Pogfish");
		}
	},
};

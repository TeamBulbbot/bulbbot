const mongoose = require("mongoose");
var clc = require("cli-color");

const Infraction = require("../models/infraction");

module.exports = {
	// Add a new infraction to the database
	Add: async (guildId, action, targetId, moderatorId, reason) => {
		inf = new Infraction({
			_id: mongoose.Types.ObjectId(),
			guildID: guildId,
			action: action,
			targetID: targetId,
			moderatorID: moderatorId,
			reportReason: reason,
			date: new Date(),
		});
		inf.save().catch((err) => console.error(clc.red(err)));
	},
};

const mongoose = require("mongoose");

const infractionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	action: String,
	targetID: String,
	moderatorID: String,
	reportReason: String,
	date: Date,
});

module.exports = mongoose.model("Infraction", infractionSchema, "infractions");

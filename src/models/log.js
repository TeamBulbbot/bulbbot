const mongoose = require("mongoose");

const logsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	modAction: String,
	message: String,
	role: String,
	member: String,
	channel: String,
	join_leave: String,
});

module.exports = mongoose.model("Log", logsSchema, "logs");

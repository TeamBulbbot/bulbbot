const mongoose = require("mongoose");

const commandAnalyticsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	commandName: String,
	uses: Number,
});

module.exports = mongoose.model("CommandAnalytics", commandAnalyticsSchema, "commandAnalytics");

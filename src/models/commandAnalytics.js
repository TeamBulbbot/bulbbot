const mongoose = require("mongoose");

const commandAnalyticsSchema = mongoose.Schema({
	commandName: String,
	uses: Number,
});

module.exports = mongoose.model("CommandAnalytics", commandAnalyticsSchema);

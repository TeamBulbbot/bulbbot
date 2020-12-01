const mongoose = require("mongoose");

const globalSchema = mongoose.Schema({
	infCounter: Number,
	commandsFire: Number,
	totalMessages: Number,
});

module.exports = mongoose.model("Global", globalSchema);

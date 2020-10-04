const mongoose = require("mongoose");

const automodSchema = mongoose.Schema({
    enabled: Boolean,
    guildId: String,
    warnThreshold: Number,
    kickThreshold: Number,
    banThreshold: Number,
    maxInterval: Number,
    maxDuplicatesWarning: Number,
    maxDuplicatesKick: Number,
    maxDuplicatesBan: Number
});

module.exports = mongoose.model("Automod", automodSchema, "automod");
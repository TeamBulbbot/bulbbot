const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
  guildID: String,
  guildName: String,
  guildPrefix: String,
  trackAnalytics: Boolean,
  joinDate: Date,
});

module.exports = mongoose.model("Guild", guildSchema);

const mongoose = require("mongoose");

const infractionSchema = mongoose.Schema({
  guildID: String,
  action: String,
  targetID: String,
  moderatorID: String,
  reportReason: String,
  date: Date,
});

module.exports = mongoose.model("Infraction", infractionSchema, "infractions");

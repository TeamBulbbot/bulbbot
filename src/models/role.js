const mongoose = require("mongoose");

const rolesSchema = mongoose.Schema({
  guildID: String,
  admin: String,
  moderator: String,
  mute: String,
  trusted: String,
});

module.exports = mongoose.model("Role", rolesSchema, "roles");

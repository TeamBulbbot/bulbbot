const mongoose = require("mongoose");
const Guild = require("../models/guild");
var clc = require("cli-color");

module.exports = async (client, guild) => {
  Guild.findOneAndDelete(
    {
      guildID: guild.id,
    },
    (err, res) => {
      if (err) console.error(clc.red(err));
      console.log(clc.yellow("[-] Removed from server"));
    }
  );
};

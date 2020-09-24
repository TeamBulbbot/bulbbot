const Log = require("../../models/log");
const Discord = require("discord.js");
var clc = require("cli-color");

function sendEmbed(client, channelId, text) {
  let embed = new Discord.MessageEmbed()
    .setColor(process.env.COLOR)
    .setTimestamp()
    .setTitle(text);
  client.channels.cache.get(channelId).send(embed);
}

module.exports = {
  Change_Mod_Action: async (client, guildId, channelId) => {
    Log.findOneAndUpdate(
      { guildID: guildId },
      { modAction: channelId },
      function (error) {
        if (error) {
          console.error(clc.red(error));
        }
      }
    );
    sendEmbed(client, channelId, "This channel is setup to log mod actions");
  },
  Change_Message: async (client, guildId, channelId) => {
    Log.findOneAndUpdate(
      { guildID: guildId },
      { message: channelId },
      function (error) {
        if (error) {
          console.error(clc.red(error));
        }
      }
    );
    sendEmbed(
      client,
      channelId,
      "This channel is setup to log message updates"
    );
  },
  Change_Role: async (client, guildId, channelId) => {
    Log.findOneAndUpdate({ guildID: guildId }, { role: channelId }, function (
      error
    ) {
      if (error) {
        console.error(clc.red(error));
      }
    });
    sendEmbed(client, channelId, "This channel is setup to log role updates");
  },
  Change_Member: async (client, guildId, channelId) => {
    Log.findOneAndUpdate({ guildID: guildId }, { member: channelId }, function (
      error
    ) {
      if (error) {
        console.error(clc.red(error));
      }
    });
    sendEmbed(client, channelId, "This channel is setup to log member updates");
  },
  Change_Channel: async (client, guildId, channelId) => {
    Log.findOneAndUpdate(
      { guildID: guildId },
      { channel: channelId },
      function (error) {
        if (error) {
          console.error(clc.red(error));
        }
      }
    );
    sendEmbed(
      client,
      channelId,
      "This channel is setup to log channel changes"
    );
  },
  Change_Join_Leave: async (client, guildId, channelId) => {
    Log.findOneAndUpdate(
      { guildID: guildId },
      { join_leave: channelId },
      function (error) {
        if (error) {
          console.error(clc.red(error));
        }
      }
    );
    sendEmbed(
      client,
      channelId,
      "This channel is setup to log join leave logs"
    );
  },
};

const Guild = require("../../handlers/configuration/guild");
const Log = require("../../handlers/configuration/logs");
const Role = require("../../handlers/configuration/roles");
const Emotes = require("../../emotes.json");

module.exports = {
  name: "configure",
  aliases: ["cfg", "setting", "config"],
  category: "configuration",
  description: "Modify settings on the bot in your guild",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send(":lock: Missing permission ``MANAGE_GUILD``"); // I know best has permssion lol
    if (args[0] === undefined || args[0] === null)
      return message.channel.send(
        `${Emotes.actions.warn} Missing required argument \`\`setting\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value>\`\``
      );
    if (args[1] === undefined || args[1] === null)
      return message.channel.send(
        `${Emotes.actions.warn} Missing required argument \`\`new value\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value>\`\``
      );
    const setting = args[0].toLowerCase();
    const newValue = args[1];

    switch (setting) {
      // Guild configuration
      case "prefix": // Change the bot prefix
        Guild.Change_Prefix(message.guild.id, newValue);
        message.channel.send(
          `Successfully updated the prefix to \`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;

      case "track_analytics":
        Guild.Track_Analytics(message.guild.id, newValue);
        message.channel.send(
          `Successfully update the state of tracking analytics to  \`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;

      // Log configuration
      case "mod_action":
        Log.Change_Mod_Action(
          client,
          message.guild.id,
          newValue.replace(/\D/g, "")
        );
        message.channel.send(
          `Now logging \`\`mod actions\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;
      case "message":
        Log.Change_Message(
          client,
          message.guild.id,
          newValue.replace(/\D/g, "")
        );
        message.channel.send(
          `Now logging \`\`message logs\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;
      case "role":
      case "role_update":
        Log.Change_Role(client, message.guild.id, newValue.replace(/\D/g, ""));
        message.channel.send(
          `Now logging \`\`role updates\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;
      case "member":
      case "member_update":
        Log.Change_Member(
          client,
          message.guild.id,
          newValue.replace(/\D/g, "")
        );
        message.channel.send(
          `Now logging \`\`member updates\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;
      case "channel":
      case "channel_update":
        Log.Change_Channel(
          client,
          message.guild.id,
          newValue.replace(/\D/g, "")
        );
        message.channel.send(
          `Now logging \`\`channel updates\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;
      case "join_leave":
        Log.Change_Join_Leave(
          client,
          message.guild.id,
          newValue.replace(/\D/g, "")
        );
        message.channel.send(
          `Now logging \`\`join leave logs\`\` in ${newValue} in **${message.guild.name}**`
        );
        break;

      // Role configuration
      case "admin":
        Role.Change_Admin_role(message.guild.id, newValue.replace(/\D/g, ""));
        message.channel.send(
          `Changed the admin role to \`\`${newValue.replace(
            /\D/g,
            ""
          )}\`\` in **${message.guild.name}**`
        );
        break;
      case "mod":
      case "moderator":
        Role.Change_Mod_role(message.guild.id, newValue.replace(/\D/g, ""));
        message.channel.send(
          `Changed the moderator role to \`\`${newValue.replace(
            /\D/g,
            ""
          )}\`\` in **${message.guild.name}**`
        );
        break;
      case "mute":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "trusted":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;

      // Setting configuration
      case "lang":
      case "language":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "delete_server_invites":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "trusted_server_invites":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "allow_non_latin_usernames":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "dm_on_action":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "censored_words":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "delete_links":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      case "trusted_links":
        message.channel.send(
          `\`\`${newValue}\`\` in **${message.guild.name}**`
        );
        break;
      default:
        message.channel.send(
          `${Emotes.actions.warn} Invalid \`\`setting\`\`\n${Emotes.other.tools} Correct usage of command: \`\`configure|cfg|setting|config <setting> <new value>\`\`\n**Guild settings:** \`\`prefix\`\`, \`\`track_analytics\`\`\n**Logging settings:** \`\`mod_action\`\`, \`\`message\`\`, \`\`role|role_update\`\`, \`\`member|member_update\`\`, \`\`channel|channel_update\`\`, \`\`join_leave\`\`\n**Role settings:** \`\`admin\`\`, \`\`mod|moderator\`\`, \`\`mute\`\`, \`\`trusted\`\`\n**Settings:** \`\`lang|language\`\`, \`\`delete_server_invites\`\`, \`\`trusted_server_invites\`\`, \`\`allow_non_latin_usernames\`\`, \`\`dm_on_action\`\`, \`\`censored_words\`\`, \`\`delete_links\`\`, \`\`trusted_links\`\``
        );
        break;
    }
  },
};

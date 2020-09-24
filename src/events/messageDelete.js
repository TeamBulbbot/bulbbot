const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  SendLog.Message_Log(
    client,
    message.guild.id,
    `${Emotes.other.trash} Message from **${message.author.username}**#${message.author.discriminator} was deleted in **${message.channel.name}** \`\`(${message.channel.id})\`\`\n**Content:** ${message.content}`
  );
};

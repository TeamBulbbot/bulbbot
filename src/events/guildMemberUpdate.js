const SendLog = require("../handlers/SendLog");
const Emotes = require("../emotes.json");

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

module.exports = async (client, oldUser, newUser) => {
  let change = "";
  if (oldUser.nickname !== newUser.nickname) change = "nickname";
  else if (oldUser._roles.length !== newUser._roles.length)
    oldUser._roles.length < newUser._roles.length
      ? (change = "newrole")
      : (change = "removedrole");
  else return;

  let message = "";
  let role = "";

  switch (change) {
    case "nickname":
      if (oldUser.nickname === null) oldUser.nickname = oldUser.user.username;
      if (newUser.nickname === null) newUser.nickname = newUser.user.username;
      message = `Nickname change from **${newUser.user.username}**#${newUser.user.discriminator} \`\`(${newUser.user.id})\`\`\n**Old nickname:** ${oldUser.nickname}\n**New nickname:** ${newUser.nickname}`;
      break;
    case "removedrole":
      role = newUser.guild.roles.cache.get(
        oldUser._roles.diff(newUser._roles)[0]
      );
      message = `Role was removed from **${oldUser.user.username}**#${oldUser.user.discriminator} \`\`(${oldUser.user.id})\`\`, ${role.name} \`\`(${role.id})\`\``;
      break;
    case "newrole":
      role = newUser.guild.roles.cache.get(
        newUser._roles.diff(oldUser._roles)[0]
      );
      message = `Role was added to **${newUser.user.username}**#${newUser.user.discriminator} \`\`(${newUser.user.id})\`\`, ${role.name} \`\`(${role.id})\`\``;
      break;

    default:
      message = "Please contact the developers as this should not happen";
      break;
  }

  SendLog.Member_Updates(
    client,
    newUser.guild.id,
    `${Emotes.other.wrench} ${message}`
  );
};

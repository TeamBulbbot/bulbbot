const Discord = require("discord.js");
const moment = require("moment");
const Emotes = require("../../emotes.json");
const Helper = require("../../handlers/Helper");

module.exports = {
  name: "serverinfo",
  aliases: ["server"],
  category: "information",
  description: "Gets some useful information about the server",
  run: async (client, message, _args) => {
    let guild = message.guild;

    const countOnline = guild.members.cache.filter(
      (m) => m.presence.status === "online"
    ).size;
    const countIdle = guild.members.cache.filter(
      (m) => m.presence.status === "idle"
    ).size;
    const countDnd = guild.members.cache.filter(
      (m) => m.presence.status === "dnd"
    ).size;

    const countVC = guild.channels.cache.filter((m) => m.type === "voice").size;
    const countCategory = guild.channels.cache.filter(
      (m) => m.type === "category"
    ).size;
    const countText = guild.channels.cache.filter((m) => m.type === "text")
      .size;

    const end = moment.utc().format("YYYY-MM-DD");
    const start = moment(moment(guild.createdAt).format("YYYY-MM-DD"));
    const daysSinceCreation = moment
      .duration(start.diff(end))
      .asDays()
      .toString();

    let embed = new Discord.MessageEmbed()
      .addField(
        "Sever stats",
        `Total: **${guild.memberCount}**/${guild.maximumMembers}\n${
          Emotes.status.online
        }: **${countOnline}** \n${Emotes.status.idle}: **${countIdle}** \n${
          Emotes.status.dnd
        }: **${countDnd}** \n${Emotes.status.offline}: **${
          guild.memberCount - countOnline - countIdle - countDnd
        }**`,
        true
      )
      .addField(
        "Channel stats",
        `Total **${
          countVC + countText
        }**\nCategory: **${countCategory}**\nText channels: **${countText}**\nVoice Channels: **${countVC}**`,
        true
      )
      .setTimestamp()
      .setFooter(
        `Executed by ${message.author.username}#${message.author.discriminator}`,
        message.author.avatarURL()
      );

    let boosting = `Booster Tier: **${guild.premiumTier}**\nAmount of boosters: **${guild.premiumSubscriptionCount}**`;
    if (guild.premiumTier === 1)
      boosting += `\nEmote slots: **100**\nAudio quality: **128** kbps`;
    else if (guild.premiumTier === 2)
      boosting += `\nEmote slots: **150**\nAudio quality: **256** kbps\nUpload limit: **50 MB**`;
    else if (guild.premiumTier === 3)
      boosting += `\nEmote slots: **250**\nAudio quality: **384** kbps\nUpload limit: **100 MB**`;

    embed.addField("Booster", boosting, true);

    embed.setColor(process.env.COLOR);
    if (guild.splash !== null || guild.splash !== undefined)
      embed.setImage(
        `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096`
      );
    embed.setAuthor(`${guild.name} (${guild.id})`, guild.iconURL());
    embed.setThumbnail(guild.iconURL());
    embed.setDescription(
      `${Emotes.badges.guildOwner} **Owner:** <@${guild.ownerID}> \`\`(${
        guild.ownerID
      })\`\`
                **Features:** ${await Helper.Features(guild.features)}
                **Server region:** ${await Helper.Regions(guild.region)}
                **Verfication level:** ${guild.verificationLevel}
				**Server creation:** ${moment
          .utc(guild.joinedTimestamp)
          .format("dddd, MMMM, Do YYYY")} \`\`(${daysSinceCreation.replace(
        "-",
        ""
      )} days ago)\`\`
                `
    );

    let guildRoles = [];
    let rolesLeft = 0;
    let amountOfRoles = 0;

    guild.roles.cache.forEach((role) => {
      amountOfRoles++;
      if (guildRoles.join(" ").length <= 400) guildRoles.push(role);
      else rolesLeft++;
    });
    embed.addField(
      `Roles (${amountOfRoles})`,
      `${guildRoles.join(" ")} ${
        rolesLeft !== 0 ? `and ${rolesLeft} more` : ""
      }`,
      true
    );

    let guildEmotes = [];
    let emotesLeft = 0;
    let amountOfEmotes = 0;

    guild.emojis.cache.forEach((emote) => {
      amountOfEmotes++;
      if (guildEmotes.join(" ").length <= 800) guildEmotes.push(emote);
      else emotesLeft++;
    });
    amountOfEmotes !== 0
      ? embed.addField(
          `Emotes (${amountOfEmotes})`,
          `${guildEmotes.join(" ")} ${
            emotesLeft !== 0 ? `and ${emotesLeft} more` : ""
          }`,
          true
        )
      : "";

    return message.channel.send(embed);
  },
};

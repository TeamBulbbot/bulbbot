const Command = require("./../../structures/Command")
const BulbBotUtils = require("./../../utils/BulbBotUtils")
const Discord = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Returns some useful info about a user",
            category: "Information",
            aliases: ["whois", "info", "user"],
            usage: "!userinfo [user]",
            maxArgs: 1
        })
    }

    async run(message, args) {
        let target;
        if (args[0] === undefined)
            target = message.author.id
        else
            target = args[0].replace(/\D/g, "")
        const user = message.guild.member(target)

        let description = "";
        try {
            description += BulbBotUtils.utils.badges(user.user.flags.bitfield) + "\n"
        } catch (err) {
            description += "";
        }

        description += BulbBotUtils.translation.translate("userinfo_embed_id", {user: user.user})
        description += BulbBotUtils.translation.translate("userinfo_embed_username", {user: user.user})
        description += BulbBotUtils.translation.translate("userinfo_embed_profile", {user: user.user})
        description += BulbBotUtils.translation.translate("userinfo_embed_avatar", {user: user.user})
        description += BulbBotUtils.translation.translate("userinfo_embed_bot", {user: user.user})
        description += BulbBotUtils.translation.translate("userinfo_embed_created", {user: user.user})

        if (user.premiumSinceTimestamp !== null)
            description += BulbBotUtils.translation.translate("userinfo_embed_premium", {user: user.user})
        if (user.joinedTimestamp !== 0)
            description += BulbBotUtils.translation.translate("userinfo_embed_joined", {user: user.user})

        const embed = new Discord.MessageEmbed()
            .setColor(user.roles.highest.color)
            .setTimestamp()
            .setThumbnail(user.user.avatarURL({dynamic: true}))
            .setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.avatarURL({dynamic: true}))
            .setDescription(description)
            .setFooter(BulbBotUtils.translation.translate("global_executed_by", { user: message.author }),
                message.author.avatarURL({dynamic: true})
            )

        return await message.channel.send(embed)
    }
}
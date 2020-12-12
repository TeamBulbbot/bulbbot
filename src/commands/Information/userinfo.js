const Command = require("./../../structures/Command")
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
        if (args[0] === undefined) target = message.author.id;
        else target = args[0].replace(/\D/g, "");
        let user = message.guild.member(target);

        if (!user) await this.client.users.fetch(target)

        let description = "";
        try {
            description += this.client.bulbutils.badges(user.user.flags.bitfield) + "\n"
        } catch (err) {
            description += "";
        }

        description += this.client.bulbutils.translate("userinfo_embed_id", {user: user})
        description += this.client.bulbutils.translate("userinfo_embed_username", {user: user})
        description += this.client.bulbutils.translate("userinfo_embed_profile", {user: user})
        description += this.client.bulbutils.translate("userinfo_embed_avatar", {user: user})
        description += this.client.bulbutils.translate("userinfo_embed_bot", {user: user})
        description += this.client.bulbutils.translate("userinfo_embed_created", {user: user})

        if (user.premiumSinceTimestamp !== null)
            description += this.client.bulbutils.translate("userinfo_embed_premium", {user: user})
        if (user.joinedTimestamp !== 0)
            description += this.client.bulbutils.translate("userinfo_embed_joined", {user: user})

        let color
        if (!user.roles.highest.color)
            color = process.env.EMBED_COLOR
        else
            color = user.roles.highest.hexColor

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTimestamp()
            .setThumbnail(user.user.avatarURL({dynamic: true}))
            .setAuthor(`${user.user.username}#${user.user.discriminator}`, user.user.avatarURL({dynamic: true}))
            .setDescription(description)
            .setFooter(this.client.bulbutils.translate("global_executed_by", { user: message.member }),
                message.author.avatarURL({dynamic: true})
            )

        return await message.channel.send(embed)
    }
}
const Command = require("./../../structures/Command")
const Discord = require("discord.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Returns some useful information about the current Guild",
            category: "Information",
            aliases: ["server"],
            usage: "!serverinfo",
            userPerms: ["MANAGE_GUILD"],
            clearance: 50
        });
    }

    async run(message) {

        let description = "";
        description += this.client.bulbutils.translate("serverinfo_embed_owner", {guild: message.guild})
        description += this.client.bulbutils.translate("serverinfo_embed_features", {guild: message.guild})
        description += this.client.bulbutils.translate("serverinfo_embed_region", {guild: message.guild})
        description += this.client.bulbutils.translate("serverinfo_embed_verification", {guild: message.guild})
        description += this.client.bulbutils.translate("serverinfo_embed_created", {guild: message.guild})

        let serverstats = "";
        serverstats += this.client.bulbutils.translate("serverinfo_server_stats_total", {guild: message.guild})
        serverstats += this.client.bulbutils.translate("serverinfo_server_stats_online", {guild: message.guild})
        serverstats += this.client.bulbutils.translate("serverinfo_server_stats_idle", {guild: message.guild})
        serverstats += this.client.bulbutils.translate("serverinfo_server_stats_dnd", {guild: message.guild})
        serverstats += this.client.bulbutils.translate("serverinfo_server_stats_offline", {guild: message.guild})


        const embed = new Discord.MessageEmbed()
            .setColor(process.env.EMBED_COLOR)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .addField(this.client.bulbutils.translate("serverinfo_server_stats"), serverstats, true)
            .setDescription(description)
            .setFooter(this.client.bulbutils.translate("global_executed_by", {
                user_name: message.author.username,
                user_discriminator: message.author.discriminator
            }), message.author.avatarURL({dynamic: true}))
            .setTimestamp()

        return message.channel.send(embed);
    }
}
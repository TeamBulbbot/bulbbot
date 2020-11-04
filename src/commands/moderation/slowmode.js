const Discord = require("discord.js");
const Emotes = require("../../emotes.json");
const parse = require("parse-duration");

module.exports = {
    name: "slowmode",
    aliases: [""],
    category: "moderation",
    description: "Sets a slowmode to a chosen channel",
    usage: "slowmode <channel> <seconds>",
    clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
    clearanceLevel: 50,
    run: async (client, message, args) => {

        if (!args[0])
            return message.channel.send(
                `${Emotes.actions.warn} Missing required argument \`\`channel\`\`, \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`slowmode <channel> <duration>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
            );
        
        let channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(args[0].replace('<#','').replace('>',''))
        let seconds = parse(args[1]);

        if (args[0] === undefined || args[0] === null)
            return message.channel.send(
                `${Emotes.actions.warn} Missing required argument \`\`channel\`\`\n${Emotes.other.tools} Correct usage of command: \`\`slowmode <channel> <duration>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
            );
        if (args[1] === undefined || args[1] === null)
            return message.channel.send(
                `${Emotes.actions.warn} Missing required argument \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`slowmode <channel> <duration>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
            );

        if (channel == null) {
            return message.channel.send(`${Emotes.actions.warn} Channel ${args[0]} cannot be found!`);
        }

        if (seconds == parse("0s")) {
            await channel.setRateLimitPerUser(seconds / 1000);
            return message.channel.send(`${Emotes.actions.confirm} Removed slowmode from channel ${channel}`);
        }else if (seconds < parse("1s")) {
            return message.channel.send(`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be shorter than 1 second \n${Emotes.other.tools} Correct usage of command: \`\`slowmode <channel> <duration>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``)
        }else if (seconds > parse("21600s")) {
            return message.channel.send(`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be longer than 6 hours \n${Emotes.other.tools} Correct usage of command: \`\`slowmode <channel> <duration>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``)
        }

        await channel.setRateLimitPerUser(seconds / 1000);
        message.channel.send(`${Emotes.actions.confirm} Channel ${channel} slowmode has been set to \`${args[1]}\``);
    },
}

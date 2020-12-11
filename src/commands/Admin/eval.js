const Command = require("./../../structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Evaluates the provided JavaScript code",
            category: "Admin",
            aliases: ["ev"],
            usage: "!eval <code>",
            minArgs: 1,
            maxArgs: -1,
            argList: ["code:string"],
            devOnly: true
        });
    }

    async run(message, args) {
        const clean = (text) => {
            if (typeof text === "string")
                return text
                    .replace(/`/g, "`" + String.fromCharCode(8203))
                    .replace(/@/g, "@" + String.fromCharCode(8203));
            else return text;
        };

        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            if (evaled.length > 2000) evaled = evaled.substring(0, 1980) + "...";
            if (evaled.includes(process.env.TOKEN))
                evaled = evaled.replace(
                    process.env.TOKEN,
                    "Y0U.TH0UGHT.1_W0ULD.L34V3_MY_D1SC0RD_T0K3N_H3R3"
                );

            await message.channel.send(clean(evaled), {code: "js"});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
}
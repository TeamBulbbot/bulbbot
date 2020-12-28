const Command = require("../../structures/Command");
const shell = require("shelljs");
const path = require("path");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            description: "Pulls the latest code from master and reloads the bot",
            category: "Admin",
            usage: "!update",
            devOnly: true,
        });
    }

    async run(message, args) {
        const p = path.resolve(__dirname, "");
        shell.cd(`${p}/../../../`);
        const resp = shell.exec("git pull");

        return message.channel.send(resp.stdout, {code: "yaml"});

        // TODO
        // figure out a way to restart the program
    }
};
